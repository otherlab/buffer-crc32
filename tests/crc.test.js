var crc32 = require('..');
var test = require('tap').test;


function str2arr(str) {
  var buf = Buffer(str);
  var arr = [];
  for (var i = 0; i < buf.length; ++i) arr.push(buf[i]);
  return arr;
}

function str2u8a(str) {
  return new Uint8Array(str2arr(str));
}


test('simple crc32 is no problem', function (t) {
  var input = str2u8a('hey sup bros');
  var expected = new Uint8Array([0x70, 0x55, 0xfa, 0x47]);
  t.same(crc32(input), expected);
  t.end();
});

test('another simple one', function (t) {
  var input = str2u8a('IEND');
  var expected = new Uint8Array([0x82, 0x60, 0x42, 0xae]);
  t.same(crc32(input), expected);
  t.end();
});

test('slightly more complex', function (t) {
  var input = str2u8a([0x00, 0x00, 0x00]);
  var expected = new Uint8Array([0x12, 0xd9, 0x41, 0xff]);
  t.same(crc32(input), expected);
  t.end();
});

test('complex crc32 gets calculated like a champ', function (t) {
  var input = str2u8a('शीर्षक');
  var expected = new Uint8Array([0xf1, 0xaf, 0xb8, 0x17]);
  t.same(crc32(input), expected);
  t.end();
});

test('casts to buffer if necessary', function (t) {
  var input = str2arr('शीर्षक');
  var expected = new Uint8Array([0xf1, 0xaf, 0xb8, 0x17]);
  t.same(crc32(input), expected);
  t.end();
});

test('can do signed', function (t) {
  var input = str2u8a('ham sandwich');
  var expected = -1891873021;
  t.same(crc32.signed(input), expected);
  t.end();
});

test('can do unsigned', function (t) {
  var input = str2u8a('bear sandwich');
  var expected = 3711466352;
  t.same(crc32.unsigned(input), expected);
  t.end();
});


test('simple crc32 in append mode', function (t) {
  var input = [str2u8a('hey'), str2u8a(' '), str2u8a('sup'), str2u8a(' '), str2u8a('bros')];
  var expected = new Uint8Array([0x70, 0x55, 0xfa, 0x47]);
  for (var crc = 0, i = 0; i < input.length; i++) {
    crc = crc32(input[i], crc);
  }
  t.same(crc, expected);
  t.end();
});


test('can do signed in append mode', function (t) {
  var input1 = str2u8a('ham');
  var input2 = str2u8a(' ');
  var input3 = str2u8a('sandwich');
  var expected = -1891873021;

  var crc = crc32.signed(input1);
  crc = crc32.signed(input2, crc);
  crc = crc32.signed(input3, crc);

  t.same(crc, expected);
  t.end();
});

test('can do unsigned in append mode', function (t) {
  var input1 = str2u8a('bear san');
  var input2 = str2u8a('dwich');
  var expected = 3711466352;

  var crc = crc32.unsigned(input1);
  crc = crc32.unsigned(input2, crc);
  t.same(crc, expected);
  t.end();
});

