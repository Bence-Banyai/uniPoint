<script setup lang="ts">
const props = defineProps({
    id: {
        type: String,
        default: 'password'
    },
    label: {
        type: String,
        default: 'Password'
    },
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Enter your password'
    },
    required: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);
const showPassword = ref(false);

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('update:modelValue', target.value);
};
</script>

<template>
    <div>
        <label :for="id" class="block text-sm font-medium text-gray-700">{{ label }}</label>
        <div class="relative mt-1">
            <input :id="id" :name="id" :type="showPassword ? 'text' : 'password'" :value="modelValue"
                @input="updateValue" :placeholder="placeholder" :required="required"
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="showPassword = !showPassword"
                    class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <Icon :name="showPassword ? 'entypo:eye-with-line' : 'entypo:eye'" class="h-5 w-5" />
                </button>
            </div>
        </div>
    </div>
</template>