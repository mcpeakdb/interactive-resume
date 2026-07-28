<script setup>
import { computed } from 'vue'
import { TAGS } from '../data/resume'
import { tagStyle } from '../data/tagStyles'

const props = defineProps({
  tag: { type: String, required: true },
  active: { type: Boolean, default: false },
  count: { type: Number, default: null },
  interactive: { type: Boolean, default: false },
  label: { type: String, default: null },
})

const meta = computed(() => TAGS[props.tag] ?? { label: props.tag, color: 'slate' })
const style = computed(() => tagStyle(meta.value.color))
const text = computed(() => props.label ?? meta.value.label)
</script>

<template>
  <component
    :is="interactive ? 'button' : 'span'"
    :type="interactive ? 'button' : null"
    :aria-pressed="interactive ? active : null"
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition duration-200"
    :class="[
      active ? style.active : style.chip,
      interactive && 'hover:-translate-y-px hover:shadow-sm cursor-pointer',
    ]"
  >
    <span
      v-if="!active"
      class="h-1.5 w-1.5 rounded-full"
      :class="style.dot"
      aria-hidden="true"
    />
    {{ text }}
    <span v-if="count !== null" class="tabular-nums opacity-60">{{ count }}</span>
  </component>
</template>
