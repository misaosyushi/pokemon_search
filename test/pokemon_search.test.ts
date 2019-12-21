import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import PokemonSearch = require('../lib/pokemon_search-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PokemonSearch.PokemonSearchStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});