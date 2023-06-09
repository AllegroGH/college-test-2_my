#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';
import _ from 'lodash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = process.argv[2];
const content = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');

// BEGIN
const mobIndex = 0;
const strengthIndex = 1;
const lifeIndex = 2;
const countIndex = 3;
const heightIndex = 4;
const weightIndex = 5;
const priceIndex = 6;

const parse = (content) => {
  const strings = content.split('\r\n').slice(1);
  // prettier-ignore
  return strings.map((el) => el
    .split('|')
    .filter((el) => el !== '')
    .map((el) => el.trim()),
  );
};

const getPriceStrengthFirstSecond = (data, firstCount, secondCount) => {
  const sortedPrices = _.union(_.sortBy(data.map((el) => Number(el[priceIndex]))));
  const firstStrengthMobPrice = sortedPrices[sortedPrices.length - 1];
  const secondStrengthMobPrice = sortedPrices[sortedPrices.length - 2];
  return firstStrengthMobPrice * firstCount + secondStrengthMobPrice * secondCount;
};

const getThinAndThickUnitsPrice = (data) => {
  const units = _.sortBy(
    data.map((el) => [Number(el[countIndex]), Number(el[weightIndex]), Number(el[priceIndex])]),
    1,
  );
  const thinUnits = [units[0][0], units[0][2]];
  const thickUnits = [units[units.length - 1][0], units[units.length - 1][2]];
  return [thinUnits[0] * thinUnits[1], thickUnits[0] * thickUnits[1]];
};

const getDevStrPriceUnits = (data) => {
  const units = _.sortBy(
    data.map((el) => [el[mobIndex], Number(el[priceIndex]) / Number(el[strengthIndex])]),
    1,
  );
  return [units[0][0], units[units.length - 1][0]];
};

const army10k = (data) => {
  const units = _.sortBy(
    data.map((el) => [el[mobIndex], el[priceIndex], Number(el[priceIndex]) / Number(el[strengthIndex])]),
    2,
  ).filter(([, value]) => value <= 10000);
  const [unit, price] = units[units.length - 1];
  return [unit, Math.floor(10000 / price)];
};

const data = parse(content);
console.log(`Mob types: ${data.length}`);

const curPrice = getPriceStrengthFirstSecond(data, 10, 20);
console.log(`10 most strength and 20 second strength price: ${curPrice}`);

const [thinsPrice, thicksPrice] = getThinAndThickUnitsPrice(data);
console.log(`Thin party price: ${thinsPrice}`);
console.log(`Thick party price: ${thicksPrice}`);

const [unProfMob, profMob] = getDevStrPriceUnits(data);
console.log(`Unprofitable mob: ${unProfMob}`);
console.log(`Profitable mob: ${profMob}`);

const [bestUnit, partyCount] = army10k(data);
console.log(`Best army is ${partyCount} partys of ${bestUnit}'s`);

army10k(data);
// END
