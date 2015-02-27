var assert = require('assert');
var year = '2013';
var sport = 'ncaa-mens-basketball';
var BracketFinder = require('bracket-finder');
var config = {
    domain: "tweetyourbracket.com",
    tags: ["tybrkt"]
};
var finder = new BracketFinder({domain: config.domain, tags: config.tags, year: year, sport: sport});
var Entry = require('../lib/entry');
var Locks = require('../lib/locks');
var logger = require('bucker').createNullLogger();


describe('Tweet watcher', function () {
    it('Should find a valid bracket from a tweet with a domain+bracket and bracket', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            tweet: require('./data/tag-domain-bracket'),
            locks: new Locks({sport: sport, year: year}),
            sport: sport,
            year: year
        }).test(function (err, result) {
            assert.equal(err, null);
            assert.equal(result, 'MW191241137211237131W1854631021532522S18541131021532533E195463721432121FFMWEMW');
            done();
        });
    });

    it('Should fail since entries are locked', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            locks: new Locks({locks: '2013-03-20T02:25:17.000Z'}),
            tweet: require('./data/tag-domain-bracket'),
            sport: sport,
            year: year
        }).test(function (err) {
            assert.equal(true, err instanceof Error);
            assert.equal(err.message, 'Entry is outside of the allotted time');
            done();
        });
    });

    it('Should not find a valid bracket from a tweet with a domain-bracket and tags', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            locks: new Locks({forceUnlock: true}),
            tweet: require('./data/tag-domain-nobracket'),
            sport: sport,
            year: year
        }).test(function (err) {
            assert.equal(true, err instanceof Error);
            assert.equal(err.message, 'Entry does not contain a bracket');
            done();
        });
    });

    it('Should find a valid bracket from a tweet with a short domain+bracket and tags', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            locks: new Locks({forceUnlock: true}),
            tweet: require('./data/tag-shortdomain-bracket'),
            sport: sport,
            year: year
        }).test(function (err, result) {
            assert.equal(err, null);
            assert.equal(result, 'MW18121311372112117177W168124631028123101233S181241131028411104114E1954614721462466FFWSS');
            done();
        });
    });

    //notag-domain-nobracket
    it('Should not find a bracket from a tweet with a domain but nothing else', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            locks: new Locks({forceUnlock: true}),
            tweet: require('./data/notag-domain-nobracket'),
            sport: sport,
            year: year
        }).test(function (err) {
            assert.equal(true, err instanceof Error);
            assert.equal(err.message, 'Entry does not contain a bracket');
            done();
        });
    });

    //notag-nodomain-nobracket
    it('Should not find a bracket from a tweet with nothing', function (done) {
        new Entry({
            logger: logger,
            finder: finder,
            locks: new Locks({forceUnlock: true}),
            tweet: require('./data/notag-nodomain-nobracket'),
            sport: sport,
            year: year
        }).test(function (err) {
            assert.equal(true, err instanceof Error);
            assert.equal(err.message, 'Entry does not contain a bracket');
            done();
        });
    });

    it('Should throw an error if entry is created with no data', function () {
        assert.throws(function () {
            new Entry({
                logger: logger,
                finder: finder
            });
        });
    });
});