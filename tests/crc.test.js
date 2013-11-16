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


test('simple crc32 is no problem', function(t) {
  var input = str2u8a('hey sup bros');
  var expected = 1207588208;
  t.same(crc32(input), expected);
  t.end();
});

test('another simple one', function(t) {
  var input = str2u8a('IEND');
  var expected = -1371381630;
  t.same(crc32(input), expected);
  t.end();
});

test('slightly more complex', function(t) {
  var input = str2u8a([0x00, 0x00, 0x00]);
  var expected = -12461806;
  t.same(crc32(input), expected);
  t.end();
});

test('complex crc32 gets calculated like a champ', function(t) {
  var input = str2u8a('शीर्षक');
  var expected = 397979633;
  t.same(crc32(input), expected);
  t.end();
});

test('casts to Uint8Array from Array if necessary', function(t) {
  var input = str2arr('शीर्षक');
  var expected = 397979633;
  t.same(crc32(input), expected);
  t.end();
});

test('casts to Uint8Array from ArrayBuffer if necessary', function(t) {
  var input = new Uint8Array([0x45, 0x23, 0x24, 0x5c]).buffer;
  var expected = 615543763;
  t.same(crc32(input), expected);
  t.end();
});

test('can append to previous results', function(t) {
  var input1 = str2u8a('ham');
  var input2 = str2u8a(' ');
  var input3 = str2u8a('sandwich');
  var expected = -1891873021;

  var crc = crc32(input1);
  crc = crc32(input2, crc);
  crc = crc32(input3, crc);

  t.same(crc, expected);
  t.end();
});
