//以下習題取自https://ithelp.ithome.com.tw/articles/10239009
//本習題僅供自己練習使用，如有冒犯或侵權還請通知 謝謝
//本人e-mail shong_forever@hotmail.com


//practice 1 
const pipe = (...fns) => (x) => fns.reduce((v, f) => {
    console.log(f)
    console.log(v)
    return f(v)
}, x);
const lower = str => str.toLowerCase();
const words = str => str.split(' ');
const reverse = arr => arr.reverse();
const splice = arr => {
    let newarr = [];
    for (let i in arr) {
        if (arr[i].length > 3) {
            newarr.push(arr[i])
        }
    }
    return newarr;
};
pipe(lower, words, reverse, splice)('HI THE WORLD come!');

//es6
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const lower = str => str.toLowerCase();
const words = str => str.split(' ');
const reverse = arr => arr.reverse();
const splice = arr => arr.filter(obj => obj.length > 3);
pipe(lower, words, reverse, splice)('HI THE WORLD come!');