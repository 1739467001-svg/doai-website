/**
 * Vercel Serverless 入口：把所有 /api/* 请求交给同一个 Express app，
 * 保证组队/核销/报名等全部端点共享同一份运行时状态。
 * 注意：Serverless 文件系统是临时的（/tmp），冷启动后运行时数据重置；
 * 正式持久化需要接数据库（Upstash / RDS 等）。
 */
import app from '../server.js';

export default app;

export const config = { maxDuration: 30 };
