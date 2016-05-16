# vue-msg-bag

Simple message bag plugin for Vue.js.


## Usage

~~~
Vue.use(require('vue-msg-bag'), options);
~~~

The default objects stored in the message bag (if not parsed) will contain three parameters; `msg`, `type` and `container`.

To tweak the msg stored in the message bag check the `parseMsg` option below.

We can watch changes in the message bag by simply watching the `$msgBag` object in the root of the app.

~~~
<template>
    <div>
        <div v-for="msg in $msgBag.all()" v-if="msg.container === 'main'">
            <div class="alert-{{ msg.type }}">{{ msg.msg }}</div>
        </div>
    </div>

    <router-view></router-view>
</template>

<script> 
    export default {
        data() {
            return {
                $msgBag: this.$msgBag
            };
        }
    }
</script>
~~~

In the above example the messages will automatically clear after some timeout (which can be set in options).

However messages can also be cleared manually by setting `timeout` to `null`. In this case the `clear(msg)` method can be used to remove the item from the message bag.

~~~
<div>
    <div v-for="msg in $msgBag.all()" v-if="msg.container === 'main'">
        <div class="alert-{{ msg.type }}">
            {{ msg.msg }}
            <span v-on:click="$msgBag.clear(msg)">x</span>
        </div>
    </div>
</div>
~~~


## Methods

`**succes**` `**warning**` `**error**` `**fatal**`

All follow the same format.

~~~
this.$msgBag.success(msg);
this.$msgBag.success(msg, 'some-container');
~~~

**NOTE:** The msg can be an `Object`, `Array` or `String`. The array itself can also be an array of objects or strings or even more arrays.

`**clear**`

Clear the message bag. A specific message can also be cleared by passing it in.

~~~
this.$msgBag.clear();
this.$msgBag.clear(msg);
~~~


`**all**`

Get all the messages.

~~~
this.$msgBag.all();
~~~


## Options

`**timeout**`

**default:** 1500

The timeout before clearing a message. To prevent clearing of messages set timeout to `null`.

`**container**`

**default:** 'main'

Arbitrary field for container name. This allows multiple containers. A good example could be displaying errors in a modal versus in some global container.

`**parseMsg**`

**default:** function

Allows parsing of the messages stored in the message bag. Pretty much anything can be stored in the message bag as it's just an array.

~~~
Vue.use(require('vue-msg-bag'), {
    parseMsg: function (msg) {
        
        // Do some stuff

        return msg;
    }
});
~~~