import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// GPU-first rendering (user rule 12) — don't throw render work on the CPU.
// - WebGL (three.js scenes) rasterizes through ANGLE -> the NVIDIA GPU.
// - Frame encoding uses NVENC when possible (h264/h265 on Windows + NVIDIA).
// NVENC ignores CRF — control file size with --video-bitrate per render
// (~8M at 1080p, ~24M at 4K; see SKILLS § Render).
Config.setChromiumOpenGlRenderer("angle");
Config.setHardwareAcceleration("if-possible");
