const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an empty array when passed an empty array", () => {
    const input = [];
    const actual = formatDates(input);
    const expected = [];
    expect(actual).to.deep.equal(expected);
  });
  it("returns an array of a single object with the converted date", () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    const actual = formatDates(input);
    const expected = [{ created_at: new Date(1542284514171) }];
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        created_at: 1542284514171
      }
    ];
    formatDates(input);
    expect(input).to.deep.equal([
      {
        created_at: 1542284514171
      }
    ]);
    expect(input).to.not.equal([
      {
        created_at: 1542284514171
      }
    ]);
  });
  it("return an array of objects with their date converted to the correct format", () => {
    const input = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        body: "some gifs",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: 1289996514171
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        body: "small body",
        votes: 0,
        topic: "mitch",
        author: "rogersop",
        created_at: 1289996514171
      }
    ];
    const actual = formatDates(input);
    const expected = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        body: "some gifs",
        votes: 0,
        topic: "mitch",
        author: "icellusedkars",
        created_at: new Date(1289996514171)
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        body: "small body",
        votes: 0,
        topic: "mitch",
        author: "rogersop",
        created_at: new Date(1289996514171)
      }
    ];
    expect(actual).to.deep.equal(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("returns an object with a key of an owner's forename and with the value of an owner ID when passed an array containing a relevant object", () => {
    const input = [
      {
        article_id: 11,
        title: "Am I a cat?"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { "Am I a cat?": 11 };
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        article_id: 11,
        title: "Am I a cat?"
      }
    ];
    makeRefObj(input);
    expect(input).to.deep.equal([
      {
        article_id: 11,
        title: "Am I a cat?"
      }
    ]);
    expect(input).to.not.equal([
      {
        article_id: 11,
        title: "Am I a cat?"
      }
    ]);
  });
  it("returns an object with a key of an owner's forename and with the value of an owner ID when passed an array containing multiple relevant object", () => {
    const input = [
      {
        article_id: 11,
        title: "Am I a cat?"
      },
      { article_id: 12, title: "Moustache" },
      { article_id: 7, title: "Z" }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { "Am I a cat?": 11, Moustache: 12, Z: 7 };
    expect(actual).to.deep.equal(expected);
  });
});

describe("formatComments", () => {
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.deep.equal({});
  });
  it("returns an of one object with the 'belongs_to' key changed to an 'article_id' key and the value changed, the name of the 'created_by' key changed to 'author", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "Sabrina Spellman"
      }
    ];
    const referenceInput = { "Living in the shadow of a great man": 14 };
    const actual = formatComments(input, referenceInput);
    const expected = [{ article_id: 14, author: "Sabrina Spellman" }];
    expect(actual).to.deep.equal(expected);
  });
  it("does not mutate the original array", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "Sabrina Spellman"
      }
    ];
    makeRefObj(input, { "Living in the shadow of a great man": 14 });
    expect(input).to.deep.equal([
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "Sabrina Spellman"
      }
    ]);
    expect(input).to.not.equal([
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "Sabrina Spellman"
      }
    ]);
  });
  it("returns an of multiple objects with the 'belongs_to' key changed to an 'article_id' key and the value changed, the name of the 'created_by' key changed to 'author", () => {
    const input = [
      {
        belongs_to: "Living in the shadow of a great man",
        created_by: "Sabrina Spellman"
      },
      {
        belongs_to: "Sony Vaio; or, The Laptop",
        created_by: "Steve Jobs"
      }
    ];
    const referenceInput = {
      "Living in the shadow of a great man": 14,
      "Sony Vaio; or, The Laptop": 8
    };
    const actual = formatComments(input, referenceInput);
    const expected = [
      { article_id: 14, author: "Sabrina Spellman" },
      { article_id: 8, author: "Steve Jobs" }
    ];
    expect(actual).to.deep.equal(expected);
  });
});
