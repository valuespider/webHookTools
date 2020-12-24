### 更新于 2020-5-14 By 阿布。

What's new?

1：更新了 stringify 的逻辑，由于 stringify 的调用太频繁，如果每次都断住，这样很不合理，于是判断增加关键字，
比如关键字为 abcde，那么当被转换对象其中内容包含 abcde 的时候，才会断住。如果不包含，就正常输入被调用，不会断住。



### 更新于 2020-5-14 By 阿布。

What's new?

1 ：勾选 hook debugger 后 ,可打开 F12 之后 按 Alt+Shift+D 来呼出 Attach 来解决所有常量 debugger。
解决：
直接写在 js 里的 debugger 常量无法 hook（其实也行，但是我不知道怎么写在扩展里） --》 现在知道咋写进去了 - - 。


### 更新于 2020-5-13 By 阿布。

主要解决问题..

1、基于 console 的 devtool 检测
有些网站会用 console 来检测是否打开了 F12（开发者工具），所以直接 hook console 对象 让所有输出失效，已达到过检测的目的。

2、基于 pushState 的卡浏览器
有些网站会不停的往 Chrome 缓存里塞东西（多见于 sojson 和一些仿 sojson 的网站），已干掉。

3、基于 debugger 的卡浏览器 检测 devtool
动态 debugger hook 了 Function.protype.constructor 替换所有的 debugger 字符（直接写在 js 里的 debugger 常量无法 hook（其实也行，但是我不知道怎么写在扩展里），只能自己右键，下一个条件断点过掉。）

4、基于 regexp 的代码风格检测
用正则检测代码是否格式化，直接干掉。

5、基于 sojson 的反调试
对于 sojsonV5，一键过所有反调试。

6、基于 setInterval 的反调试
hook setInterval，使其无法生效，但保留原有特征（无法被检测到是否被 hook 了，且当有函数检测时会提示。）

7、基于 cookies 的加密定位
大家都懂的。。

8、基于 stringify 的 hook
大家都懂的，实在找不到入口的时候，可以碰碰运气，一般在密码算法或特殊加密前，都会把明文对象通过 stringify 转为字符串。

9、基于懒，所以会不断完善。。。
