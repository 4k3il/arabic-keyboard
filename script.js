document.addEventListener('DOMContentLoaded', () => {
       const input = document.getElementById('input');
       const output = document.getElementById('output');
       const copyButton = document.getElementById('copyButton');
       const shareButton = document.getElementById('shareButton');
       const darkModeButton = document.getElementById('darkModeButton');
       const clearButton = document.getElementById('clearButton');
       const languageSelector = document.getElementById('languageSelector');

       // قاموس أشكال الحروف حسب موقعها (بداية، وسط، نهاية)
       const arabicForms = {
           'ا': { isolated: '\uFE8D', end: '\uFE8E', start: '\uFE8D', middle: '\uFE8D' },
           'ب': { isolated: '\uFE8F', end: '\uFE90', start: '\uFE91', middle: '\uFE92' },
           'ت': { isolated: '\uFE95', end: '\uFE96', start: '\uFE97', middle: '\uFE98' },
           'ث': { isolated: '\uFE99', end: '\uFE9A', start: '\uFE9B', middle: '\uFE9C' },
           'ج': { isolated: '\uFE9D', end: '\uFE9E', start: '\uFE9F', middle: '\uFEA0' },
           'ح': { isolated: '\uFEA1', end: '\uFEA2', start: '\uFEA3', middle: '\uFEA4' },
           'خ': { isolated: '\uFEA5', end: '\uFEA6', start: '\uFEA7', middle: '\uFEA8' },
           'د': { isolated: '\uFEA9', end: '\uFEA9', start: '\uFEA9', middle: '\uFEA9' },
           'ذ': { isolated: '\uFEAB', end: '\uFEAB', start: '\uFEAB', middle: '\uFEAB' },
           'ر': { isolated: '\uFEAD', end: '\uFEAD', start: '\uFEAD', middle: '\uFEAD' },
           'ز': { isolated: '\uFEAF', end: '\uFEAF', start: '\uFEAF', middle: '\uFEAF' },
           'س': { isolated: '\uFEB1', end: '\uFEB2', start: '\uFEB3', middle: '\uFEB4' },
           'ش': { isolated: '\uFEB5', end: '\uFEB6', start: '\uFEB7', middle: '\uFEB8' },
           'ص': { isolated: '\uFEB9', end: '\uFEBA', start: '\uFEBB', middle: '\uFEBC' },
           'ض': { isolated: '\uFEBD', end: '\uFEBE', start: '\uFEBF', middle: '\uFEC0' },
           'ط': { isolated: '\uFEC1', end: '\uFEC2', start: '\uFEC3', middle: '\uFEC4' },
           'ظ': { isolated: '\uFEC5', end: '\uFEC6', start: '\uFEC7', middle: '\uFEC8' },
           'ع': { isolated: '\uFEC9', end: '\uFECA', start: '\uFECB', middle: '\uFECC' },
           'غ': { isolated: '\uFECD', end: '\uFECE', start: '\uFECF', middle: '\uFED0' },
           'ف': { isolated: '\uFED1', end: '\uFED2', start: '\uFED3', middle: '\uFED4' },
           'ق': { isolated: '\uFED5', end: '\uFED6', start: '\uFED7', middle: '\uFED8' },
           'ك': { isolated: '\uFED9', end: '\uFEDA', start: '\uFEDB', middle: '\uFEDC' },
           'ل': { isolated: '\uFEDD', end: '\uFEDE', start: '\uFEDF', middle: '\uFEDF' },
           'م': { isolated: '\uFEE1', end: '\uFEE2', start: '\uFEE3', middle: '\uFEE4' },
           'ن': { isolated: '\uFEE5', end: '\uFEE6', start: '\uFEE7', middle: '\uFEE8' },
           'ه': { isolated: '\uFEE9', end: '\uFEEA', start: '\uFEEB', middle: '\uFEEC' },
           'و': { isolated: '\uFEED', end: '\uFEED', start: '\uFEED', middle: '\uFEED' },
           'ي': { isolated: '\uFEF1', end: '\uFEF2', start: '\uFEF3', middle: '\uFEF4' },
           'ء': { isolated: '\uFE80', end: '\uFE80', start: '\uFE80', middle: '\uFE80' },
           'ى': { isolated: '\uFEEF', end: '\uFEEF', start: '\uFEEF', middle: '\uFEEF' },
           ' ': { isolated: ' ', end: ' ', start: ' ', middle: ' ' }
       };

       // تحديد شكل الحرف حسب موقعه
       const getForm = (char, prevChar, nextChar) => {
           if (!arabicForms[char]) return char;

           // معالجة حالة "لام-ألف" (ﻼ)
           if (char === 'ل' && nextChar === 'ا') {
               return '\uFEFC'; // ﻼ
           }

           const isStart = !prevChar || prevChar === ' ';
           const isEnd = !nextChar || nextChar === ' ';

           if (isStart && isEnd) return arabicForms[char].isolated;
           if (isStart) return arabicForms[char].start;
           if (isEnd) return arabicForms[char].end;
           return arabicForms[char].middle;
       };

       // تحويل النص إلى أشكال صحيحة
       const convertText = (text) => {
           let result = '';
           for (let i = 0; i < text.length; i++) {
               const char = text[i];
               const prevChar = text[i - 1];
               const nextChar = text[i + 1];

               // تخطي حرف "ا" إذا كان يتبع "ل" مباشرة
               if (char === 'ا' && prevChar === 'ل') {
                   continue;
               }

               result += getForm(char, prevChar, nextChar);
           }
           return result;
       };

       // عكس النص مع تحويل الحروف
       const reverseText = (text) => {
           return convertText(text).split('').reverse().join('');
       };

       // تحديث النص المعكوس تلقائيًا
       input.addEventListener('input', (e) => {
           output.value = reverseText(e.target.value);
       });

       // نسخ النص
       copyButton.addEventListener('click', () => {
           output.select();
           document.execCommand('copy');
           alert('✓ تم النسخ!');
       });

       // مشاركة النص
       shareButton.addEventListener('click', () => {
           if (navigator.share) {
               navigator.share({
                   title: 'النص المعكوس',
                   text: output.value,
               });
           } else {
               alert('المشاركة غير مدعومة في هذا المتصفح.');
           }
       });

       // الوضع الليلي
       darkModeButton.addEventListener('click', () => {
           document.body.classList.toggle('dark-mode');
           document.querySelector('.container').classList.toggle('dark-mode');
       });

       // مسح الحقول
       clearButton.addEventListener('click', () => {
           input.value = '';
           output.value = '';
       });

       // دعم اللغات
       languageSelector.addEventListener('change', (e) => {
           if (e.target.value === 'ar') {
               input.placeholder = 'اكتب النص العربي هنا...';
               output.placeholder = 'النص المعكوس سيظهر هنا...';
           } else if (e.target.value === 'en') {
               input.placeholder = 'Type English text here...';
               output.placeholder = 'Reversed text will appear here...';
           }
       });
   });
