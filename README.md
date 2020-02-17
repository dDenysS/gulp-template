# Начало
Посмотрев на календарь, я понял, что уже 2020, а посмотрев на свою сборку, которая была с 2018 года (скопировал я ее с сайта в 2017), я понял, что пора её менять. В этой статье мы разберем структуру проекта, плагины (минимальный набор функционала) и их новые возможности, которые добавились за такое большое время. Мы разберем все моменты, чтобы новичок мог себе скачать эту сборку и начать с ней работать.

Не только древность моей сборки мотивировала на эту статью, но и еще одна причина: мне больно смотреть, когда заходят на онлайн-сервисы для конвертации `scss`, минификации `javascript` и других рутинных задач. Самое забавное - когда сделали мелкую правку, снова нужно проходить все круги ~~ада~~ копипаста.

Перед тем, как вы начнете читать, хочу сказать, что материала очень много, поэтому писал только основное. Слишком очевидных вещий старался не писать, но хотел, чтобы смог понять каждый новичок. Если будут непонятные моменты, то смело переходите по ссылкам и читайте более подробную информацию, а потом снова возвращайтесь к статье. Можете задавать вопросы в комментариях, всем постараюсь ответить.
<cut/>

# Поехали!
## Gulp
Начнем с главного в нашей сборке.

Gulp - это наш фундамент, потому что он будет управлять всеми нашими задачами, другими словами, `taskmanager`. Концепция задач очень проста. Название асинхронной javascript функции равно названию задачи, и работает она по принципу: берет данные, трансформирует их и записывает результат.
<spoiler title="Пример минификации сss">
![](https://habrastorage.org/webt/lj/g3/hv/ljg3hvoy9axohgzzd19rde6ziwo.png)
</spoiler>

Как видим, все просто: называем нашу задачу `css`, вызываем функцию `src`, которая берет данные по определенному шаблону и передает данные по трубе (функция `pipe()`). Внутри `pipe` вызываем функцию плагина, которая трансформирует наши данные и результат передает функцию `dest`. `dest` - записывает результат по указанному пути.

С `pipe` можно выстраивать любые цепочки.
<spoiler title="Пример">
![](https://habrastorage.org/webt/ia/ar/oj/iaarojs2o_yxufltm0wtwuglmvc.png)
</spoiler>

В четвертой версии много чего изменилось, но на что нужно точно обратить внимание - это на `gulp.series()` и `gulp.parallel()`. Позже мы разберем параллельное выполнение задач.

Как вы заметили, в примерах я экспортировал функции, в старом API использовали `gulp.task()`:
```javascript
gulp.task('taskName',function() {
    //do somethings
})
```
Больше не рекомендуется использовать `gulp.task()`.

 Экспортирование функций позволяет разделять на публичные и приватные задачи.
 - `публичные задачи` - экспортируются из вашего gulpfile, что позволяет запускать их командой gulp.
 - `приватные задачи` - создаются для внутреннего использования, как правило, в составе `series()` или `parallel()`

Пару слов о шаблонах поиска файлов в функции `src`.
- `templates/*.html` - ищет файлы с расширением `html` в папке `templates`
- `templates/**/*.html` - ищет файлы с расширением `html` во всех папках, которые в `templates`

Более подробная информация [здесь](https://gulpjs.com/docs/en/getting-started/explaining-globs), [здесь](https://gulpjs.com/docs/en/api/concepts#globs) и [здесь](https://github.com/gulpjs/glob-parent).

# Структура проекта
После того, как мы разобрались с фундаментом нашего проекта, начнем делать первые шаги. Проверяем, установлены ли `node.js` и `npm`.
<spoiler title="Команды в консоли">
![](https://habrastorage.org/webt/gr/vw/jq/grvwjqqbyh2ntjayjcmo33p4uvm.png)
</spoiler>
Если они не установлены, следуйте инструкциям [здесь](https://nodejs.org/en/).

Создаем папку для нашего проекта. Внутри инициализируем npm `npm init --yes`
Ключ `--yes` означает автоматические ответы вопрос по проекту.

Создадим три папки:
- `build` - оптимизированные файлы для использования на сервере
- `src` - рабочая папка, где будут храниться все наши исходники
- `gulp` - здесь будут храниться наши tasks

Еще добавим файл `.gitignore`, чтобы системные файлы не попадали в репозиторий.
Папка `/build` задокументирована, потому что часто использую `GitHub Pages` для демонстрации работы.

Не забудьте установить gulp: <code>npm install --save-dev gulp</code>

<spoiler title=".gitignore">

```gitignore
# Файлы и папки операционной системы
.DS_Store
Thumbs.db

# Файлы редактора
.idea
*.sublime*
.vscode

# Вспомогательные файлы
*.log*
node_modules/

# Папка с собранными файлами проекта
# build/
```
</spoiler>

# Первые шаги

## HTML
У НTML сильно громоздкий синтаксис, и при большой вложенности тегов сложно разобрать код. Еще одна проблема в том, что многие забывают закрывать теги. Можно возразить, что сейчас умные IDE без проблем индицируют эти проблемы, но, как правило, новички не обращают внимания, что там им говорит IDE, и еще грешат форматированием кода.
<spoiler title="Пример немного не реалистичный, но почти такое делают">
![bad format html](https://hsto.org/files/646/cbc/f0a/646cbcf0a5374071b8396372602f3693.png)
</spoiler>

Все наши проблемы решает [Pug](https://pugjs.org/language/doctype.html). Одного примера будет достаточно, чтобы понять, как его использовать. Не понимаю, почему этот плагин еще повсюду не используют.
<spoiler title="Пример базового функционала">
![](https://habrastorage.org/webt/pa/_j/g7/pa_jg7rtrtanxwpv8tvd0s2ftma.jpeg)
</spoiler>

Новичкам советую обратить внимание еще на несколько возможностей:
- `Разделение на модули` - удобно, когда используешь БЭМ: один блок - один файл. [Подробнее.](https://pugjs.org/language/includes.html)

<spoiler title="Пример из документации">
![](https://habrastorage.org/webt/sx/pp/lz/sxpplzqdystfm-q9skym2nvr860.jpeg)
</spoiler>

- `Миксины` - удобно использовать для однотипных блоков. Например, карточки товаров или комментариев. [Подробнее.](https://pugjs.org/language/mixins.html)

<spoiler title="Пример с документации">
![](https://habrastorage.org/webt/jz/hr/fh/jzhrfhh8czcyhetry6o2l9zmale.jpeg)
</spoiler>

- `Циклы` для генерации однотипных блоков. [Подробнее.](https://pugjs.org/language/iteration.html)

<spoiler title="Пример с документации">
![](https://habrastorage.org/webt/bu/uj/bn/buujbnhfu4atbiffqueuhj6dfw8.jpeg)
</spoiler>

За последнее время сильно ничего не изменилось, только название с `Jade` на `Pug`. [Подробнее.](https://github.com/pugjs/pug#rename-from-jade)

## Разделяем HTML
На нашем сайте будут две тестовые страницы `about` и `index`. Структура на страницах повторяется: есть блоки `<footer>`, `<header>`, `<head>`. Поэтому все нужно вынести в отдельные ~~файлы~~ модули.
<spoiler title="Структура проекта">
![](https://habrastorage.org/webt/3q/oc/pq/3qocpq4irq54xl73aj-ntmduues.jpeg)
</spoiler>

Разберем все более подробно.
- `pages` - папка для наших страниц, где в корне хранятся непосредственно страницы
- `common` - хранятся общие блоки для всех страниц
- `includes` - хранятся модули страниц, где внутри еще одна папка, которая соответствует названию страницы

Пройдемся по файлам:
- `layout.pug` - шаблон, который хранит основную структуру, и от него наследуются все другие страницы

<spoiler title="layout.pug">
![](https://habrastorage.org/webt/fz/sc/vm/fzscvmvbtb8unlkflcv3dljnsto.jpeg)
</spoiler>

- `index.pug` и `about.pug` - наши страницы, которые наследуются от шаблона и подключают свои контентные модули

<spoiler title="pages/index.pug и pages/about.pug">
![](https://habrastorage.org/webt/7e/ks/_i/7eks_in5xmluxdnr0skrmosk6x0.jpeg)
</spoiler>

Еще, обратите внимание, у `pug` есть  комментарии, которые **попадают** в `html` и которые **нет**. [Подробнее здесь.](https://pugjs.org/language/comments.html)

# Автоматизируем первую задачу
Установим плагин [gulp-pug](https://www.npmjs.com/package/gulp-pug) для компиляции наших шаблонов. Выполните в консоли команду: `npm i gulp-pug`
Создадим файл `pug2html.js` в папке `gulp/tasks`.
<spoiler title="pug2html.js">
![](https://habrastorage.org/webt/k1/u3/3z/k1u33z0_89gnnzufrt3djtrfcx0.png)
</spoiler>
Здесь все понятно: ищем файлы по указанному пути, компилируем и результат выгружаем в папку `build`. Еще добавим [pug-linter](https://www.npmjs.com/package/gulp-pug-linter), чтобы новички не косячили и сохраняли единый стиль написания кода. Для конфигурации создадим файл `.pug-lint.json` в корне проекта. Правила для линтера писал на свой вкус. Вы без проблем сможете изменить. [Список правил.](https://github.com/pugjs/pug-lint/blob/master/docs/rules.md)

Теперь подключаем нашу задачу в файле `gulpfile.js`.
<spoiler title="gulpfile.js">
![](https://habrastorage.org/webt/ld/58/yr/ld58yrcupgcyq7d1wt4rkazzgiu.png)
</spoiler>
Здесь мы создаем серию с одной таски с названием `start`; потом мы добавим ещё. Теперь в консоли выполните команду `gulp start`, и в папке `build` должны появиться два файла: `index.html` и `about.html`.

Еще добавим [gulp-w3c-html-validator](https://www.npmjs.com/package/gulp-w3c-html-validator), чтобы не было нелепых ошибок. Вы, наверное, догадались, что порядок подключения плагинов c помощью `pipe()` очень важен. То есть перед тем, как вызвать плагин `pug()` для компиляции, нужно сделать валидацию плагином `pugLinter()`, а плагин `gulp-w3c-html-validator` подключаем после `pug()`, потому что нам нужно валидировать скомпилированный `html`.

Последний плагин [gulp-html-bem-validator](https://www.npmjs.com/package/gulp-html-bem-validator) - самописный плагин, сделал на скорую руку, потому что не смог найти аналогов. Очень маленький функционал, думаю, со временем буду улучшать.
<spoiler title="Пример работы плагина">
![](https://habrastorage.org/webt/rq/7w/yu/rq7wyu9-264hjg8vxoqlxoxaz5o.jpeg)
</spoiler>
<spoiler title="Финальный код таски pug2html.js">
 ![](https://habrastorage.org/webt/nf/co/kw/nfcokwsfdntczlzy9_ngkebv9_g.png)
</spoiler>

# Стили
Для стилей мы будем использовать [Scss](https://sass-lang.com/). Все дается по аналогии с задачей `pug2html`. Создаем новую папку `styles` и скачиваем нужные пакеты <code>npm install node-sass gulp-sass --save-dev</code>.
Дальше пишем задачу, как и делали раньше. Берем файлы, передаем в плагин и потом сохраняем результат.
<spoiler title="tasks/styles.js">
![](https://habrastorage.org/webt/l3/iq/ss/l3iqssvcxnlzz9mrezqisvirsxk.png)
</spoiler>

Дальше мы добавим вспомогательные плагины: `npm i gulp-autoprefixer  gulp-shorthand gulp-clean-css gulp-sourcemaps stylelint gulp-stylelint stylelint-scss stylelint-config-standard-scss stylelint-config-standard stylelint-config-htmlacademy`

Пройдемся по каждому плагину:
- [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) - автоматическая расстановка префиксов для старых браузеров.
- [gulp-shorthand](https://www.npmjs.com/package/gulp-shorthand) - сокращает стили.

<spoiler title="Пример">
![](https://habrastorage.org/webt/sm/d3/rd/smd3rdyqmjbao3xpl9zmy3dkyxo.jpeg)
</spoiler>

- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) - минификация стилей
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) - [ответ](https://qna.habr.com/q/284526) на вопрос: "Что это такое и зачем нужно?"
- [stylelint](https://github.com/stylelint/stylelint) [gulp-stylelint](https://www.npmjs.com/package/gulp-stylelint) [stylelint-scss](https://www.npmjs.com/package/stylelint-scss) - плагины для проверки наших стилей
- [stylelint-config-htmlacademy](https://github.com/htmlacademy/stylelint-config-htmlacademy) [stylelint-config-standard](hhttps://github.com/stylelint/stylelint-config-standard) [stylelint-config-standard-scss](https://www.npmjs.com/package/stylelint-config-standard-scss) - готовые конфиги, которые мы подключили в свой конфиг

Файлы styles:
<spoiler title="Структура папки styles">
![](https://habrastorage.org/webt/ql/gh/32/qlgh32ysgiw-v-qi3cwaxoadj60.jpeg)
</spoiler>
<spoiler title="global.scss">
![](https://habrastorage.org/webt/vs/mo/z0/vsmoz0dz_gy0gxdjrv0enwcjkj0.png)
</spoiler>
<spoiler title="media.scss">
![](https://habrastorage.org/webt/fm/yu/q8/fmyuq8ggcbkcks5cpc6fhnijupa.png)
</spoiler>

Немного обсудим файл `media.scss`. Есть два варианта организации медиа-запросов.
1. Писать медиа-запросы ко всему блоку в конце файла.
2. Писать медиа-запросы в самом селекторе, используя `@mixin` и `@include`.

<spoiler title="Пример второго варианта">
![](https://habrastorage.org/webt/rw/nd/md/rwndmdltykxzsgjjg--0dho2moq.png)
</spoiler>

Я поклонник второго варианта, удобно, когда все стили в одном месте, и не нужно никуда скроллить и ничего искать.

Последний шаг: подключим [normalize.css](http://necolas.github.io/normalize.css/). Установим командой `npm install normalize.css`
и добавим `@import "../../../node_modules/normalize.css/normalize";`  в начале файла `global.scss`
[Зачем нужен normalize.css?](https://htmlacademy.ru/blog/useful/css/about-normalize-css)

# JavaScript
Все делаем так же, как и с другими тасками, только подключаем другие плагины.
Установим сначала все необходимые зависимости `npm i gulp-babel @babel/core @babel/preset-env --save-dev`
и зависимости для [eslint](https://eslint.org/) `npm install eslint eslint-config-htmlacademy eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node --save-dev`
- [gulp-babel](https://www.npmjs.com/package/gulp-babel) [@babel/core](https://www.npmjs.com/package/@babel/core) [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env) - [babel](https://babeljs.io/) конвертирует ECMAScript 2015+ код в более старую версию

<spoiler title="Пример">
![](https://habrastorage.org/webt/wx/tc/0o/wxtc0o201ahjphpgm6osrv_jjos.jpeg)
</spoiler>

- [gulp-terser](https://www.npmjs.com/package/gulp-terser) - минификация и оптимизация javascript.

<spoiler title="Задача script">
![](https://habrastorage.org/webt/hw/mo/6-/hwmo6-afrzokestl5bwjdj7jgxw.png)
</spoiler>

- [eslint](https://eslint.org/) - мы уже знаем, что делают линтеры. Решил подключить готовые конфиги, потому что очень много разных правил, чтобы все настраивать с нуля.
 
<spoiler title=".eslintrc.json">
![](https://habrastorage.org/webt/pt/6y/r9/pt6yr9qvwxwfnqldc8nuv4qogtk.png)
</spoiler>

# Оптимизируем картинки, копируем шрифты, делаем svg-sprite
Устанавливаем плагины `npm i gulp-imageMinify gulp-svgstore`
Для картинок используется банальный код, который вы уже на данном этапе без проблем можете понять.

Шрифты мы просто копируем.

Не вижу смысла объяснять, как делать svg спрайты, когда в интернете много статей. [Вот одна из них](http://glivera-team.github.io/svg/2016/06/13/svg-sprites-2.html).

# Экономим время
Чтобы каждый раз не обновлять страницу при изменении файла, подключим [browser-sync](https://www.browsersync.io/). У gulp есть встроенная функция,которая следит за изменениями и вызывает нужные нам функции. Советую зайти и почитать о возможностях [browsersync](https://www.browsersync.io/). Мне очень нравится возможность открытия сайта и синхронизации прокрутки страницы на нескольких устройствах. Очень удобно верстать адаптивные сайты: открыл на компьютере, открыл на телефоне - и сразу видишь результат.
<spoiler title="Наш локальный сервер. Задача serve">
![](https://habrastorage.org/webt/wn/hi/mc/wnhimc3agc9cozu7n54ebiq5-nm.png)
</spoiler>

Бывает такое, что сделал опечатку, сохранил код и сборка падает с ошибкой. Нужно снова перезапускать сборку, и со временем это может начать раздражать, поэтому установим `npm i gulp-plumber`. [Plumber](https://www.npmjs.com/package/gulp-plumber) будет перехватывать ошибки, и после устранения ошибки сборка восстановит работоспособность. Интегрировать его очень просто, добавляем его первым `.pipe(plumber())` в наших ~~трубопроводах~~ цепочках `pug2html` и `styles`.

Во время разработки мы будем создавать и удалять файлы. Так как у нас `live reload`, то созданные файлы автоматически попадут в `build`. Когда чуть позже мы решим удалить файл, то он останется в папке `build`, поэтому сделаем еще одну задачу `clean`, которая будет удалять папку. Установим плагин `npm install del`. [Del](https://www.npmjs.com/package/del).
```javascript
const del = require('del')

module.exports = function clean(cb) {
  return del('build').then(() => {
    cb()
  })
}
```
**Главное - не забыть вызвать функцию-callback, которая сообщит gulp, что задача выполнена.**

### Lighthouse

> [Lighthouse](https://github.com/GoogleChrome/lighthouse) - решение для веб-приложений и веб-страниц, которое собирает современные показатели производительности.

Кстати, некоторые заказчики смотрят на эти показатели, так как не знают других способов оценить качество верстки.

Вы можете возразить, зачем ради одной странички заморачиваться, но в реальных проектах их может быть больше 10.
<spoiler title="Скрин с реального проекта">
![](https://habrastorage.org/webt/pn/l5/mm/pnl5mmzzrdljesd2hl4-zhpkke4.jpeg)
</spoiler>
Устанавливаем `npm i --save-dev gulp-connect lighthouse chrome-launcher`  и создаём задачу.
Результат для каждой странички будет генерироваться в папку `./reports`. Там будут 'html' файлы, они открываются автоматически, но вы сами в любой момент можете их открыть и посмотреть результат.

На первый взгляд может показаться, что лучше запустить несколько страниц на тестирование, но этого нельзя сделать в одном запущенном процессе хрома, а если запустить несколько процессов паралельно, то результаты могут быть очень неточные.
<spoiler title="lighthouse.js">
![](https://habrastorage.org/webt/0_/3f/uo/0_3fuonzaxnhu8fzrdocxxqbrky.png)
</spoiler>
Кода многовато, но он простой. Запустили наш локальный сервер с помощью `browser-sync`, потом хром и в конце `lighthouse`, где говорим, по какому `url` искать наш сайт.
# Копируем зависимости
В нашей команде есть правило, что все `dependencies` нужно загружать в репозиторий. Это было связано с тем, что иногда может пропасть интернет ~~в стране~~. Вручную скачивать пакеты с сайтов и загружать их в папку не очень удобно, ещё сложно следить за версиями пакетов, и каждый раз из node_modules обновлять также не очень удобно, поэтому мы должны оптимизировать этот процесс.

[gulp-npm-dist](https://www.npmjs.com/package/gulp-npm-dist) - очень хороший плагин, мне он нравится тем, что он не просто копирует всю папку модуля, а только нужные файлы. `README.md`, `LICENSE`, `.gitignore` и другие конфигурационные файлы не копируются.

Теперь сделаем, чтобы при изменении `package.json` вызывался плагин. Не вижу смысла сильно заморачиваться и следить только за изменениями объекта `dependencies`, поэтому будем просто следить за файлом.

# NPM-скрипты
Последняя оптимизация. Часто сложно и лень запоминать консольные команды, там много параметров, вводить все эти пути занимает время,
поэтому запишем длинные команды в более краткие команды.

Рассмотрим такую ситуацию: вы скопировали большой кусок кода с постороннего ресурса, и
он не соответствует вашим правилам форматирования.
Не будете же вы всё править руками? Можно просто в консоли ввести команду, которая все исправит
за вас `stylelint ./src/styles/**/*.scss --fix --syntax scss`, команда длинная,  поэтому запишем ее в NPM-скрипт
<spoiler title="Добавили NPM-скрипт">
![](https://habrastorage.org/webt/kt/sd/8j/ktsd8jvsodx0lo0mowygm6kxmiu.jpeg)
</spoiler>

Как видим на скрине, теперь в консоли можно вводить `npm run stylelint-fix`.

Напишем еще несколько команд:

- `npm run start` - вместо `gulp`, привык, что любой проект у меня запускается этой командой
- `npm run build` - вместо `gulp build`, такая же ситуация, как в прошлом пункте
- `npm run lighthouse` - вместо `gulp build && gulp lighthouse`, сначала собираем проект, а потом уже тестируем
- `npm run test` - запуск разных линтеров, хорошей практикой будет запускать перед комитом

# PRE-COMMIT
Не верю я, что вы будете перед комитом запускать `npm run test`, даже не верю, что я буду. Поэтому скачаем [husky](https://www.npmjs.com/package/husky) и добавим: 
 ```javascript
"husky": {
    "hooks": {
      "pre-commit": "npm run test"
    }
  }
```
в `package.json`. Если `npm run test` вернет ошибку, то комит не будет сделан.

# Спасибо
Очень приятно, если вы прочли всю статью и сумели принять мои мысли. Отвечу на вопросы в комментариях и жду ваших `pull requests` и `issue`. Всем приятных сборок.

Ссылка на репозиторий с тем, что у нас получилось: [github](https://github.com/dDenysS/gulp-template).
