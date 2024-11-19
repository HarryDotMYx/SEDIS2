import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from 'dayjs';
import is from 'is_js';
import { debounce, throttle } from 'lodash';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  return dayjs(date).format('MMMM D, YYYY');
};

export const formatDateTime = (date: Date | string) => {
  return dayjs(date).format('MMMM D, YYYY h:mm A');
};

export const isValidEmail = (email: string) => {
  return is.email(email);
};

export const debouncedFn = debounce((fn: Function) => fn(), 300);

export const throttledFn = throttle((fn: Function) => fn(), 300);