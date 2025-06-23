"use strict";
exports.id = 125;
exports.ids = [125];
exports.modules = {

/***/ 3331:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3719);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gatsby__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(123);
/* harmony import */ var react_helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8154);
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4038);
/* harmony import */ var react_transition_group__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6488);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5556);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var styled_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1864);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7110);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6673);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5793);
const StyledMainContainer=styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].main.withConfig({displayName:"sc-404__StyledMainContainer",componentId:"sc-bnxlhm-0"})(["",";flex-direction:column;"],({theme})=>theme.mixins.flexCenter);const StyledTitle=styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].h1.withConfig({displayName:"sc-404__StyledTitle",componentId:"sc-bnxlhm-1"})(["color:var(--green);font-family:var(--font-mono);font-size:clamp(100px,25vw,200px);line-height:1;"]);const StyledSubtitle=styled_components__WEBPACK_IMPORTED_MODULE_6__["default"].h2.withConfig({displayName:"sc-404__StyledSubtitle",componentId:"sc-bnxlhm-2"})(["font-size:clamp(30px,5vw,50px);font-weight:400;"]);const StyledHomeButton=(0,styled_components__WEBPACK_IMPORTED_MODULE_6__["default"])(gatsby__WEBPACK_IMPORTED_MODULE_1__.Link).withConfig({displayName:"sc-404__StyledHomeButton",componentId:"sc-bnxlhm-3"})(["",";margin-top:40px;"],({theme})=>theme.mixins.bigButton);const NotFoundPage=({location})=>{const{0:isMounted,1:setIsMounted}=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);const prefersReducedMotion=(0,_hooks__WEBPACK_IMPORTED_MODULE_5__/* .usePrefersReducedMotion */ .jt)();(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{if(prefersReducedMotion){return;}const timeout=setTimeout(()=>setIsMounted(true),_utils__WEBPACK_IMPORTED_MODULE_3__/* .navDelay */ .LF);return()=>clearTimeout(timeout);},[]);const content=/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledMainContainer,{className:"fillHeight"},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledTitle,null,"404"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledSubtitle,null,"Page Not Found"),/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(StyledHomeButton,{to:"/"},"Go Home"));return/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components__WEBPACK_IMPORTED_MODULE_4__/* .Layout */ .PE,{location:location},/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_helmet__WEBPACK_IMPORTED_MODULE_2__.Helmet,{title:"Page Not Found"}),prefersReducedMotion?/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment),null,content):/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .A,{component:null},isMounted&&/*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(react_transition_group__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A,{timeout:500,classNames:"fadeup"},content)));};NotFoundPage.propTypes={location:(prop_types__WEBPACK_IMPORTED_MODULE_9___default().object).isRequired};/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NotFoundPage);

/***/ })

};
;
//# sourceMappingURL=component---src-pages-404-js.js.map