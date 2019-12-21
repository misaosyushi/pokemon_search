#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { PokemonSearchStack } from '../lib/pokemon_search-stack';

const app = new cdk.App();
new PokemonSearchStack(app, 'PokemonSearchStack');
