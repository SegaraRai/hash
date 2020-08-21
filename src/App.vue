<script lang="ts">
import { onMounted, onUnmounted, ref, watchEffect, watch } from 'vue';
import { DigestAlgorithm, calcHash, isSupported } from './lib/hash';
import { usePreferenceStore } from './stores/preference';

export default {
  name: 'App',
  components: {},
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const preferenceStore = usePreferenceStore();

    const supported = isSupported();
    const { algorithm, upperCase } = preferenceStore;
    const src = ref<string>('');
    const dest = ref<string>('');

    if (supported) {
      watch([src, algorithm, upperCase], async () => {
        dest.value = '';
        const hash = (await calcHash(src.value, algorithm.value)) || '';
        dest.value = upperCase.value ? hash.toUpperCase() : hash;
      }, {
        immediate: true,
      });
    }

    return {
      algorithm$$q: algorithm,
      upperCase$$q: upperCase,
      src$$q: src,
      dest$$q: dest,
      theme$$q: preferenceStore.theme,
      supported$$q: supported,
    };
  },
};
</script>

<template>
  <header>
    <nav class="flex items-center justify-between px-6 py-2" :class="$style.nav$$q">
      <div class="flex items-center flex-shrink-0 mr-6 text-white">
        <span class="font-semibold text-xl tracking-tight">Hash</span>
      </div>
      <div class="flex-grow"></div>
      <label class="block">
        <div class="inline-block mr-2 font-medium">テーマ</div>
        <div class="inline-block relative">
          <select v-model="theme$$q" :class="$style.input$$q" class="pr-8 leading-none">
            <option value="auto">システム</option>
            <option value="light">ライト</option>
            <option value="dark">ダーク</option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </label>
    </nav>
  </header>
  <main class="container mx-auto">
    <div class="mx-auto lg:flex lg:flex-row">
      <div class="lg:flex-1 lg:mr-2">
        <template v-if="supported$$q">
          <label class="block mt-2">
            <div class="font-medium">元の文字列</div>
            <textarea v-model="src$$q" :class="$style.input$$q" class="h-32"></textarea>
          </label>
          <div class="flex items-end mt-4">
            <label class="block flex-grow">
              <div class="font-medium">ハッシュアルゴリズム</div>
              <div class="relative">
                <select v-model="algorithm$$q" :class="$style.input$$q" class="pr-8">
                  <option>SHA-1</option>
                  <option>SHA-256</option>
                  <option>SHA-384</option>
                  <option>SHA-512</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </label>
            <label class="block flex-grow ml-8 pb-3 font-medium">
              <input v-model="upperCase$$q" type="checkbox" class="mr-2 leading-tight">
              大文字にする
            </label>
          </div>
          <label class="block mt-4">
            <div class="font-medium">文字列のハッシュ（UTF-8）</div>
            <input v-model="dest$$q" type="text" :class="$style.input$$q" readonly>
          </label>
          <div class="mt-4">
            <div>ハッシュ値の計算は、サーバーを介さず、すべてブラウザ内で行われます</div>
          </div>
        </template>
        <template v-else>
          <div class="mt-2 text-red-600">
            お使いのブラウザはハッシュ値の計算に対応しておりません<br>
            最新版のGoogle ChromeまたはMozilla Firefoxをお使いください
          </div>
        </template>
      </div>
      <div class="lg:flex-1 lg:w-64 lg:ml-2 mt-4 lg:mt-0">
        <table class="table-auto w-full">
          <thead>
            <tr>
              <th :class="$style.th$$q">アルゴリズム</th>
              <th :class="$style.th$$q">ビット長</th>
              <th :class="$style.th$$q">バイト長</th>
              <th :class="$style.th$$q">HEX長</th>
              <th :class="$style.th$$q">
                Base64長<span class="text-red-600 ml-1">*</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td :class="$style.td$$q">MD5</td>
              <td :class="$style.td$$q">128</td>
              <td :class="$style.td$$q">16</td>
              <td :class="$style.td$$q">32</td>
              <td :class="$style.td$$q">24 (22)</td>
            </tr>
            <tr :class="$style.evenTd$$q">
              <td :class="$style.td$$q">SHA-1</td>
              <td :class="$style.td$$q">160</td>
              <td :class="$style.td$$q">20</td>
              <td :class="$style.td$$q">40</td>
              <td :class="$style.td$$q">28 (27)</td>
            </tr>
            <tr>
              <td :class="$style.td$$q">SHA-256</td>
              <td :class="$style.td$$q">256</td>
              <td :class="$style.td$$q">32</td>
              <td :class="$style.td$$q">64</td>
              <td :class="$style.td$$q">44 (41)</td>
            </tr>
            <tr :class="$style.evenTd$$q">
              <td :class="$style.td$$q">SHA-384</td>
              <td :class="$style.td$$q">384</td>
              <td :class="$style.td$$q">48</td>
              <td :class="$style.td$$q">96</td>
              <td :class="$style.td$$q">64 (64)</td>
            </tr>
            <tr>
              <td :class="$style.td$$q">SHA-512</td>
              <td :class="$style.td$$q">512</td>
              <td :class="$style.td$$q">64</td>
              <td :class="$style.td$$q">128</td>
              <td :class="$style.td$$q">88 (86)</td>
            </tr>
          </tbody>
        </table>
        <div class="mt-1">
          <span class="text-red-600 mr-1">*</span>
          括弧内はパディング（<code>=</code>）を含めない長さ
        </div>
      </div>
    </div>
  </main>
</template>

<style module>
.nav {
  @apply bg-gray-500;
}

:global(.theme--dark) .nav {
  @apply bg-gray-700;
}

.input {
  @apply bg-white;
  @apply text-gray-900;
  @apply border-gray-300;

  @apply border;
  @apply py-2;
  @apply px-4;
  @apply block;
  @apply w-full;
  @apply appearance-none;
  @apply leading-normal;
}

.input:not(select):read-only {
  @apply bg-gray-200;
}

:global(.theme--dark) .input:not(select):read-only {
  @apply bg-gray-700;
}

.input:focus {
  @apply outline-none;
}

:global(.theme--dark) .input {
  @apply bg-gray-900;
  @apply text-gray-100;
  @apply border-gray-600;
}

.th {
  @apply px-4;
  @apply py-2;
}

.td {
  @apply border;
  @apply px-4;
  @apply py-2;
}

.even-td {
  @apply bg-gray-200;
}

:global(.theme--dark) .even-td {
  @apply bg-gray-800;
}
</style>
