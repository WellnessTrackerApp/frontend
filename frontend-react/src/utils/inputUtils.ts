export const preventForbiddenInputNumberKeys = (
  e: React.KeyboardEvent<HTMLInputElement>
) => {
  const forbiddenKeys = ["e", "E", "-", "+"];

  if (forbiddenKeys.includes(e.key)) {
    e.preventDefault();
  }
};
