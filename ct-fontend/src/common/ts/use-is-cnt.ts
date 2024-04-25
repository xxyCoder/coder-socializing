import { ref } from "vue";

export function useIsAndCnt({ _is = false, _cnt = 0 }) {
  const is = ref(_is), cnt = ref(_cnt)
  function change() {
    is.value = !is.value
    is.value ? ++cnt.value : --cnt.value
  }

  return { is, cnt, change }
}