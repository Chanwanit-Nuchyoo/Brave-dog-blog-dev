export const UpdateUserRequestBody = {
  type: 'object',
  properties: {
    f_name: { type: 'string' },
    l_name: { type: 'string' },
    bio: { type: 'string' },
    avatar: { type: 'string', format: 'binary' },
  },
};

export const GetUserPostQuery = {
  name: 'order',
  required: false,
  default: 'published:desc',
};
