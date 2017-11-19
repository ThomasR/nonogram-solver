#!/usr/bin/env node

const downloadToFile = require('./downloadToFile');
const sampleIds = [
  1149,
  1608,
  2074,
  2684,
  3093,
  4388,
  4392,
  4436,
  5114,
  5126,
  5178,
  5876,
  5903,
  6004,
  6076,
  6577,
  8454,
  9664,
  10509,
  11418,
  13194,
  13677,
  14050,
  14099,
  14656,
  15283,
  15335,
  15466,
  15479,
  15500,
  15527
];

downloadToFile(sampleIds);
