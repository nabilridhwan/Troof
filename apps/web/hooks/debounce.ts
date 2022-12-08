/** @format */

// A hook for countown timer

export const customDebounce = (cb: (...args: any) => any, delay: number) => {
	let timeout: NodeJS.Timeout;

	return (...args: any[]) => {
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
};
