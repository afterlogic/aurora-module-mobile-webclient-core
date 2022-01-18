export const validators = {
  required: (val) => !!val,
  minLength: (num) => (val) => val.length >= num,
}
export const errors = {
  required: 'required',
  minLength: 'minLength',
}
