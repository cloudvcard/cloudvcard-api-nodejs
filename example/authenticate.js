"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cloudvcard_1 = require("../lib/cloudvcard");
var _ = function (text) {
    console.log(text ? text : '');
};
var cvc = new cloudvcard_1.default();
_('---------- CloudVCard API Example ----------');
_(' 1) Authorize with API secret');
_();
cvc.authorize('93d4339a-db92-4ab8-80cb-3ae8cfa3cf43')
    .then(function (token) {
    _('   Authenticated! - Returned:');
    _('   Bearer ' + token);
})
    .then(function () {
    _();
    _();
    _(' 2) Triggering vcards/get for ID: 4f0d36ba-6466-46b1-935f-0c3d5cd40368');
    _();
})
    .then(function () { return cvc.getVCard(["4f0d36ba-6466-46b1-935f-0c3d5cd40368"]); })
    .then(function (vcardresult) {
    _('   getVCard returned: ');
    _(JSON.stringify(vcardresult));
})
    .then(function () {
    _();
    _('---------- CloudVCard API Example End ----------');
});
