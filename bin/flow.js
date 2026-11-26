#!/usr/bin/env node
import { runCli } from '../src/workspace/cli.js';

process.exitCode = runCli(process.argv.slice(2));
