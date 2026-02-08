import { NextResponse } from "next/server";
import { dbConnect } from "@/database/mongoose";

interface HealthCheck {
  name: string;
  status: "healthy" | "unhealthy";
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    await dbConnect();
    return {
      name: "database",
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      name: "database",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function checkFinnhubAPI(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    const response = await fetch(
      `${process.env.FINNHUB_BASE_URL || "https://finnhub.io/api/v1"}/quote?symbol=AAPL&token=${process.env.FINNHUB_API_KEY}`,
      { cache: "no-store" }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return {
      name: "finnhub_api",
      status: "healthy",
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      name: "finnhub_api",
      status: "unhealthy",
      responseTime: Date.now() - start,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function GET() {
  const checks = await Promise.all([checkDatabase(), checkFinnhubAPI()]);
  
  const isHealthy = checks.every((check) => check.status === "healthy");
  
  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: isHealthy ? 200 : 503 }
  );
}
