interface APIClientConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
}

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number };
}

export class BaseAPIClient {
  private config: APIClientConfig;

  constructor(config: APIClientConfig) {
    this.config = config;
  }

  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    // Ensure baseURL ends with "/" so relative endpoints resolve correctly,
    // and strip leading "/" from the endpoint so it appends to the full path
    // instead of resolving against the origin alone.
    const base = this.config.baseURL.endsWith("/")
      ? this.config.baseURL
      : this.config.baseURL + "/";
    const url = new URL(endpoint.replace(/^\//, ""), base);
    
    if (config.params) {
      Object.entries(config.params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Build a redacted URL for logging (hide API tokens)
    const redactedUrl = this.redactUrl(url);

    // Implement request timeout via AbortController
    const timeoutMs = this.config.timeout || 10000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: config.method || "GET",
        headers: {
          ...this.config.headers,
          ...config.headers,
        },
        cache: config.cache,
        next: config.next,
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new APIError(
          `Request timed out after ${timeoutMs}ms for ${redactedUrl}`,
          408,
          "Request Timeout"
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    // Read the response body as text first so we can inspect it
    const responseText = await response.text();

    if (!response.ok) {
      throw new APIError(
        `Request failed: ${response.status} ${response.statusText} for ${redactedUrl}`,
        response.status,
        responseText.slice(0, 500)
      );
    }

    // Validate Content-Type before parsing as JSON
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const preview = responseText.slice(0, 200);
      const isHtml = responseText.trimStart().startsWith("<!DOCTYPE") || responseText.trimStart().startsWith("<html");
      
      const message = isHtml
        ? `API returned HTML instead of JSON for ${redactedUrl}. This usually means the API key is invalid or the endpoint is wrong.`
        : `API returned unexpected Content-Type "${contentType}" for ${redactedUrl}.`;

      throw new APIError(
        message,
        response.status,
        `Content-Type: ${contentType} | Body preview: ${preview}`
      );
    }

    // Parse JSON safely
    try {
      return JSON.parse(responseText) as T;
    } catch {
      throw new APIError(
        `Failed to parse JSON response for ${redactedUrl}`,
        response.status,
        responseText.slice(0, 500)
      );
    }
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * Redact sensitive query parameters (like API tokens) from URLs for safe logging.
   */
  private redactUrl(url: URL): string {
    const redacted = new URL(url.toString());
    const sensitiveParams = ["token", "apikey", "api_key", "key", "secret"];
    for (const param of sensitiveParams) {
      if (redacted.searchParams.has(param)) {
        redacted.searchParams.set(param, "***REDACTED***");
      }
    }
    return redacted.toString();
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody: string
  ) {
    super(message);
    this.name = "APIError";
  }
}
