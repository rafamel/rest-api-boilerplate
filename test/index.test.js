const id = (n) => `[${String(n)}] `;

test(id(1) + `Jest is running`, () => {
  expect(1).toBe(1);
});
