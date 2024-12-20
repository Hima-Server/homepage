txtに以下の形式で書き込むことでhtmlにも反映されます。<br>
※ /data/history.txtは記述方法が異なります。

# Input
```
# 見出し1

## 見出し2

### 見出し3

#### 見出し4

##### 見出し5

###### 見出し6

---

**太字**

*斜体*

**_太字で斜体_**

~~取り消し線~~

___下線と太字___

__下線__

_斜体_

リンク: [Google](https://www.google.com)

画像: ![alt text](https://via.placeholder.com/150)

1. 番号付きリスト項目1
2. 番号付きリスト項目2

- 箇条書き1
- 箇条書き2

> 引用文

||強調された部分||
```

# Output
```html
<h1>見出し1</h1>
<h2>見出し2</h2>
<h3>見出し3</h3>
<h4>見出し4</h4>
<h5>見出し5</h5>
<h6>見出し6</h6>
<hr>
<strong>太字</strong>
<em>斜体</em>
<strong><em>太字で斜体</em></strong>
<del>取り消し線</del>
<u><strong>下線と太字</strong></u>
<u>下線</u>
<em>斜体</em>
<a href="https://www.google.com" target="_blank">Google</a>
<img src="https://via.placeholder.com/150" title="alt text" alt="alt text">
<ol>
  <li>番号付きリスト項目1</li>
  <li>番号付きリスト項目2</li>
</ol>
<ul>
  <li>箇条書き1</li>
  <li>箇条書き2</li>
</ul>
<blockquote>引用文</blockquote>
<mark>強調された部分</mark>
```
