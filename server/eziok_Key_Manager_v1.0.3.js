function a0_0x233a() {
  const _0x3a4527 = [
    "aes-256-cbc",
    "getServiceId",
    "getSiteUrl",
    "length",
    "2122197JUkpBy",
    "1416443fCGYUm",
    "29QpcKCU",
    "concat",
    "ClientPrivateKey",
    "decodeProvider",
    "12762hQeOSx",
    "final",
    "utf8",
    "15ZHdjzy",
    "145356pnutnW",
    "createDecipheriv",
    "update",
    "verifyKakaoVid",
    "readFileSync",
    "siteUrl",
    "from",
    "sha256",
    "setSiteUrl",
    "hex",
    "15SaDNlh",
    "sha1",
    "key",
    "toString",
    "split",
    "-----END\x20PUBLIC\x20KEY-----",
    "45eSGGBT",
    "213594eBnXLK",
    "createHash",
    "18230FfuzgL",
    "createKey",
    "RSAEncrypt",
    "kakao",
    "constants",
    "RSAServerEncrypt",
    "getNaver",
    "getRsaPublicKey",
    "createCipheriv",
    "getRsaPrivateKey",
    "naver",
    "utf-8",
    "createIv",
    "randomBytes",
    "set",
    "exports",
    "RSA_PKCS1_OAEP_PADDING",
    "slice",
    "-----END\x20PRIVATE\x20KEY-----",
    "parse",
    "digest",
    "privateEncrypt",
    "base64",
    "get",
    "privateDecrypt",
    "SHA256",
    "1691712jShTzo",
    "publicEncrypt",
  ];
  a0_0x233a = function () {
    return _0x3a4527;
  };
  return a0_0x233a();
}
function a0_0x2a6d(_0x1db488, _0x529949) {
  const _0x233a71 = a0_0x233a();
  return (
    (a0_0x2a6d = function (_0x2a6dd7, _0x14b8b4) {
      _0x2a6dd7 = _0x2a6dd7 - 0x8a;
      let _0x59c1e5 = _0x233a71[_0x2a6dd7];
      return _0x59c1e5;
    }),
    a0_0x2a6d(_0x1db488, _0x529949)
  );
}
const a0_0x9995d0 = a0_0x2a6d;
(function (_0x9296bf, _0x3f09ce) {
  const _0x1e9246 = a0_0x2a6d,
    _0x282387 = _0x9296bf();
  while (!![]) {
    try {
      const _0x5911d8 =
        (parseInt(_0x1e9246(0xb2)) / 0x1) * (parseInt(_0x1e9246(0xb6)) / 0x2) +
        (-parseInt(_0x1e9246(0xb9)) / 0x3) * (parseInt(_0x1e9246(0xba)) / 0x4) +
        (-parseInt(_0x1e9246(0xc4)) / 0x5) * (parseInt(_0x1e9246(0x8e)) / 0x6) +
        parseInt(_0x1e9246(0xb1)) / 0x7 +
        parseInt(_0x1e9246(0xaa)) / 0x8 +
        (-parseInt(_0x1e9246(0x8d)) / 0x9) *
          (-parseInt(_0x1e9246(0x90)) / 0xa) +
        -parseInt(_0x1e9246(0xb0)) / 0xb;
      if (_0x5911d8 === _0x3f09ce) break;
      else _0x282387["push"](_0x282387["shift"]());
    } catch (_0x488bd6) {
      _0x282387["push"](_0x282387["shift"]());
    }
  }
})(a0_0x233a, 0x1ee5e);
const fs = require("fs"),
  crypto = require("crypto");
let serviceId, privateKey, providerKeyInfo;
class Eziok_Key_Manager {
  constructor() {}
  ["keyInit"](_0x4ca74b, _0x1e0ced) {
    const _0x4fa162 = a0_0x2a6d;
    var _0x242ca7 = fs[_0x4fa162(0xbe)](_0x4ca74b, _0x4fa162(0xa6));
    const _0x528d99 = this[_0x4fa162(0x91)](_0x1e0ced),
      _0x5efe3a = this[_0x4fa162(0x9c)](_0x1e0ced);
    let _0x1fdb45 = crypto[_0x4fa162(0xbb)](
        _0x4fa162(0xac),
        _0x528d99,
        _0x5efe3a
      ),
      _0x4b8d70 = _0x1fdb45[_0x4fa162(0xbc)](_0x242ca7, "base64", "utf8");
    _0x4b8d70 += _0x1fdb45[_0x4fa162(0xb7)]("utf8");
    const _0x267806 = JSON["parse"](_0x4b8d70);
    return (
      (serviceId = _0x267806["ServiceId"]),
      (privateKey = _0x267806[_0x4fa162(0xb4)]),
      (privateKey = this[_0x4fa162(0x99)](privateKey)),
      (providerKeyInfo = JSON[_0x4fa162(0xa3)](_0x267806["ProviderKeyInfo"])),
      (providerKeyInfo = this["decodeProvider"](providerKeyInfo)),
      _0x4b8d70
    );
  }
  [a0_0x9995d0(0x91)](_0x4afc09) {
    const _0x4fe355 = a0_0x9995d0;
    let _0x3b3d2f = crypto[_0x4fe355(0x8f)](_0x4fe355(0xc1))
      [_0x4fe355(0xbc)](_0x4afc09, "utf-8")
      ["digest"](_0x4fe355(0xc3));
    const _0x40308a = crypto[_0x4fe355(0x8f)](_0x4fe355(0xc1))
      [_0x4fe355(0xbc)](_0x3b3d2f, _0x4fe355(0xc3))
      [_0x4fe355(0xa4)](_0x4fe355(0xc3));
    _0x3b3d2f =
      _0x3b3d2f[_0x4fe355(0xa1)](0x0, 0x20) +
      _0x40308a[_0x4fe355(0xa1)](0x20, 0x40);
    const _0x1f4bea = Buffer[_0x4fe355(0xc0)](_0x3b3d2f, _0x4fe355(0xc3));
    return _0x1f4bea;
  }
  ["createIv"](_0x4fdb77) {
    const _0x203935 = a0_0x9995d0,
      _0xfa285e = crypto[_0x203935(0x8f)](_0x203935(0xc1))
        [_0x203935(0xbc)](_0x4fdb77, _0x203935(0x9b))
        ["digest"]("hex"),
      _0x176e62 = crypto["createHash"](_0x203935(0xc1))
        [_0x203935(0xbc)](_0xfa285e, "hex")
        [_0x203935(0xa4)](_0x203935(0xc3)),
      _0x691d01 = _0x176e62["slice"](0x0, 0x20),
      _0x24e5a7 = Buffer[_0x203935(0xc0)](_0x691d01, _0x203935(0xc3));
    return _0x24e5a7;
  }
  [a0_0x9995d0(0xb5)](_0x15cdd9) {
    const _0xe22b40 = a0_0x9995d0;
    let _0x4afebc = new Map();
    for (
      let _0x5a9c99 = 0x0;
      _0x5a9c99 < _0x15cdd9[_0xe22b40(0xaf)];
      _0x5a9c99++
    ) {
      let _0x13ca5e = new Map(),
        _0x4696cb = JSON[_0xe22b40(0xa3)](_0x15cdd9[_0x5a9c99]);
      "naver" == _0x4696cb["id"]
        ? ((_0x4696cb = this[_0xe22b40(0x96)](_0x4696cb)),
          _0x13ca5e[_0xe22b40(0x9e)](
            _0xe22b40(0xc6),
            Buffer[_0xe22b40(0xc0)](_0x4696cb["key"], _0xe22b40(0xa6))
          ),
          _0x13ca5e["set"](
            "iv",
            Buffer["from"](_0x4696cb["iv"], _0xe22b40(0xa6))
          ))
        : (_0x13ca5e["set"](
            "key",
            Buffer[_0xe22b40(0xc0)](_0x4696cb[_0xe22b40(0xc6)], "base64")
          ),
          _0x13ca5e[_0xe22b40(0x9e)](
            "iv",
            Buffer[_0xe22b40(0xc0)](_0x4696cb["iv"], _0xe22b40(0xa6))
          )),
        _0x4afebc[_0xe22b40(0x9e)](_0x4696cb["id"], _0x13ca5e);
    }
    return _0x4afebc;
  }
  [a0_0x9995d0(0x96)](_0x47560a) {
    const _0x465f95 = a0_0x9995d0;
    let _0x256d8c = crypto[_0x465f95(0x8f)](_0x465f95(0xc5))
        [_0x465f95(0xbc)](_0x47560a[_0x465f95(0xc6)], _0x465f95(0x9b))
        [_0x465f95(0xa4)](_0x465f95(0xc3)),
      _0x527533 =
        _0x256d8c["length"] <= 0x20 ? _0x256d8c[_0x465f95(0xaf)] : 0x20;
    return (
      (_0x47560a["key"] = Buffer[_0x465f95(0xc0)](
        _0x256d8c[_0x465f95(0xa1)](0x0, _0x527533),
        _0x465f95(0xc3)
      )),
      (_0x47560a["iv"] = Buffer[_0x465f95(0xc0)](
        _0x47560a["iv"],
        _0x465f95(0xb8)
      )),
      _0x47560a
    );
  }
  ["aesDecode"](_0x377891, _0xefa8b1) {
    const _0x1ce67e = a0_0x9995d0,
      _0x421be3 = providerKeyInfo["get"](_0x377891);
    let _0x22214e;
    if (_0x1ce67e(0x93) === _0x377891) {
      let _0x438eb2 = crypto[_0x1ce67e(0xbb)](
        "aes-256-ctr",
        _0x421be3[_0x1ce67e(0xa7)](_0x1ce67e(0xc6)),
        _0x421be3[_0x1ce67e(0xa7)]("iv")
      );
      return (
        (_0x22214e = _0x438eb2["update"](
          _0xefa8b1,
          _0x1ce67e(0xa6),
          _0x1ce67e(0xb8)
        )),
        (_0x22214e += _0x438eb2[_0x1ce67e(0xb7)](_0x1ce67e(0xb8))),
        _0x22214e
      );
    } else {
      if (_0x1ce67e(0x9a) === _0x377891) {
        let _0x1df197 = crypto[_0x1ce67e(0xbb)](
          "aes-128-cbc",
          _0x421be3[_0x1ce67e(0xa7)](_0x1ce67e(0xc6)),
          _0x421be3[_0x1ce67e(0xa7)]("iv")
        );
        return (
          (_0x22214e = _0x1df197["update"](
            _0xefa8b1,
            _0x1ce67e(0xa6),
            _0x1ce67e(0x9b)
          )),
          (_0x22214e += _0x1df197[_0x1ce67e(0xb7)](_0x1ce67e(0x9b))),
          _0x22214e
        );
      } else {
        let _0x220f4a = crypto[_0x1ce67e(0xbb)](
          _0x1ce67e(0xac),
          _0x421be3[_0x1ce67e(0xa7)]("key"),
          _0x421be3[_0x1ce67e(0xa7)]("iv")
        );
        return (
          (_0x22214e = _0x220f4a[_0x1ce67e(0xbc)](
            _0xefa8b1,
            _0x1ce67e(0xa6),
            _0x1ce67e(0xb8)
          )),
          (_0x22214e += _0x220f4a[_0x1ce67e(0xb7)]("utf8")),
          _0x22214e
        );
      }
    }
  }
  [a0_0x9995d0(0xad)]() {
    return serviceId;
  }
  [a0_0x9995d0(0xc2)](_0x505865) {
    this["siteUrl"] = _0x505865;
  }
  [a0_0x9995d0(0xae)]() {
    const _0x256fb4 = a0_0x9995d0;
    return this[_0x256fb4(0xbf)];
  }
  [a0_0x9995d0(0x92)](_0x3f02bd) {
    const _0x59181e = a0_0x9995d0;
    let _0x5e66bc = crypto[_0x59181e(0xa5)](
      {
        key: privateKey,
        padding: crypto[_0x59181e(0x94)]["RSA_PKCS1_PADDING"],
      },
      Buffer["from"](_0x3f02bd, "utf8")
    )["toString"](_0x59181e(0xa6));
    return _0x5e66bc;
  }
  [a0_0x9995d0(0x95)](_0x32b0d0, _0x4dbdb3) {
    const _0x2002e1 = a0_0x9995d0;
    _0x32b0d0 = this[_0x2002e1(0x97)](_0x32b0d0);
    const _0x598b26 = crypto[_0x2002e1(0x8f)](_0x2002e1(0xc1))
        [_0x2002e1(0xbc)](_0x4dbdb3, _0x2002e1(0x9b))
        ["digest"](_0x2002e1(0xa6)),
      _0x2d2653 = crypto[_0x2002e1(0x9d)](0x20),
      _0x31d8f8 = crypto[_0x2002e1(0x9d)](0x10),
      _0x2e680e = _0x4dbdb3 + "|" + _0x598b26,
      _0x77d83c = crypto[_0x2002e1(0x98)](
        _0x2002e1(0xac),
        _0x2d2653,
        _0x31d8f8
      );
    let _0x646164 = _0x77d83c[_0x2002e1(0xbc)](
      _0x2e680e,
      _0x2002e1(0x9b),
      _0x2002e1(0xa6)
    );
    _0x646164 += _0x77d83c[_0x2002e1(0xb7)](_0x2002e1(0xa6));
    const _0x3d794c = Buffer[_0x2002e1(0xb3)]([_0x2d2653, _0x31d8f8]),
      _0x2d7d28 = crypto[_0x2002e1(0xab)](
        { key: _0x32b0d0, oaepHash: "sha256" },
        _0x3d794c
      )["toString"]("base64");
    return _0x2d7d28 + "|" + _0x646164;
  }
  ["getResult"](_0x5b798f) {
    const _0x51264d = a0_0x9995d0;
    let _0x11cf77 = _0x5b798f[_0x51264d(0x8b)]("|")[0x0];
    const _0x399096 = _0x5b798f[_0x51264d(0x8b)]("|")[0x1];
    let _0x3e48cc = crypto[_0x51264d(0xa8)](
      {
        key: privateKey,
        padding: crypto[_0x51264d(0x94)][_0x51264d(0xa0)],
        oaepHash: "sha256",
        hash: _0x51264d(0xc1),
      },
      Buffer["from"](_0x11cf77, "base64")
    )["toString"](_0x51264d(0xc3));
    _0x3e48cc = Buffer["from"](_0x3e48cc, _0x51264d(0xc3));
    const _0x13fa21 = _0x3e48cc[_0x51264d(0xa1)](0x0, 0x20),
      _0x3c3944 = _0x3e48cc[_0x51264d(0xa1)](0x20, 0x30);
    let _0xf90f00 = crypto[_0x51264d(0xbb)](
        _0x51264d(0xac),
        _0x13fa21,
        _0x3c3944
      ),
      _0x32f298 = _0xf90f00[_0x51264d(0xbc)](
        _0x399096,
        _0x51264d(0xa6),
        _0x51264d(0xb8)
      );
    (_0x32f298 += _0xf90f00[_0x51264d(0xb7)](_0x51264d(0xb8))),
      (_0x32f298 = _0x32f298[_0x51264d(0x8b)]("|"));
    let _0x35b43c = _0x32f298[0x0];
    _0x35b43c = crypto[_0x51264d(0x8f)](_0x51264d(0xc1))
      [_0x51264d(0xbc)](_0x35b43c, _0x51264d(0xb8))
      [_0x51264d(0xa4)]("hex");
    let _0x282bf9 = Buffer[_0x51264d(0xc0)](_0x32f298[0x1], _0x51264d(0xa6))[
      _0x51264d(0x8a)
    ]("hex");
    if (_0x35b43c !== _0x282bf9) throw new Exception();
    return _0x32f298[0x0];
  }
  [a0_0x9995d0(0x99)](_0x176254) {
    const _0x4c73bb = a0_0x9995d0;
    return (
      "-----BEGIN\x20PRIVATE\x20KEY-----\x0a" +
      _0x176254 +
      "\x0a" +
      _0x4c73bb(0xa2)
    );
  }
  [a0_0x9995d0(0x97)](_0x1a9866) {
    const _0x63b403 = a0_0x9995d0;
    return (
      "-----BEGIN\x20PUBLIC\x20KEY-----\x0a" +
      _0x1a9866 +
      "\x0a" +
      _0x63b403(0x8c)
    );
  }
  [a0_0x9995d0(0xbd)](_0x14ad31, _0x2549ad, _0x38c7f2) {
    const _0x54071c = a0_0x9995d0;
    return (
      (_0x38c7f2 = Buffer[_0x54071c(0xc0)](_0x38c7f2, _0x54071c(0xa6))[
        _0x54071c(0x8a)
      ](_0x54071c(0xc3))),
      (_0x14ad31 = Buffer[_0x54071c(0xc0)](_0x14ad31, _0x54071c(0xa6))[
        "toString"
      ](_0x54071c(0xc3))),
      (sumCiSerial = _0x14ad31 + _0x38c7f2),
      (hashCiSerialHex = crypto["createHash"](_0x54071c(0xa9))
        ["update"](sumCiSerial, _0x54071c(0xc3))
        [_0x54071c(0xa4)](_0x54071c(0xc3))),
      _0x2549ad == hashCiSerialHex
    );
  }
}
module[a0_0x9995d0(0x9f)] = new Eziok_Key_Manager();
