export default typeof window !== 'undefined' ? window.fetch.bind(window) : fetch;
