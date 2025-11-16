export const templates = [
  {
    id: 1,
    name: 'Blank Document',
    color: 'from-blue-500 to-blue-600',
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '' }],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Meeting Notes',
    color: 'from-purple-500 to-purple-600',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Meeting Notes' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Date: ' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Attendees: ' }],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Agenda' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Topic 1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Topic 2' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Project Plan',
    color: 'from-emerald-500 to-emerald-600',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Project Plan' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Overview of the project.' }],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Milestones' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Milestone 1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Milestone 2' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Research Paper',
    color: 'from-amber-500 to-amber-600',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: 'Title of the Research Paper' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Author Name' }],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Abstract' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Write a brief summary of your research.' },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Introduction' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'Introduce the topic and background.' },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Blog Post',
    color: 'from-rose-500 to-rose-600',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Title of the Blog Post' }],
        },
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'A short introduction to the topic.' },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Main content of the blog post.' }],
        },
        {
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Key Takeaways' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Important point 1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'Important point 2' }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
