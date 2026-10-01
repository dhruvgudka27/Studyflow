import fs from "fs";

const report = JSON.parse(fs.readFileSync("./audit/lighthouse-report.report.json", "utf8"));
const categories = report.categories;
const audits = report.audits;

console.log("=== LIGHTHOUSE CATEGORIES ===");
console.log("Performance:   ", Math.round(categories.performance.score * 100));
console.log("Accessibility: ", Math.round(categories.accessibility.score * 100));
console.log("Best Practices:", Math.round(categories["best-practices"].score * 100));
console.log("SEO:           ", Math.round(categories.seo.score * 100));
console.log("=== CORE WEB VITALS ===");
console.log("FCP: ", audits["first-contentful-paint"]?.displayValue);
console.log("LCP: ", audits["largest-contentful-paint"]?.displayValue);
console.log("CLS: ", audits["cumulative-layout-shift"]?.displayValue);
console.log("TBT: ", audits["total-blocking-time"]?.displayValue);
console.log("Speed Index: ", audits["speed-index"]?.displayValue);
