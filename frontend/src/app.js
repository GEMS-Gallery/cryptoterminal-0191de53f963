import { backend } from 'declarations/backend';

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const input = document.getElementById('command-input');

const commands = {
    help: () => `Available commands:
  help - Show this help message
  list - List all blog posts
  view [id] - View a specific blog post
  add - Add a new blog post
  clear - Clear the terminal`,
    list: async () => {
        const posts = await backend.getPosts();
        if (posts.length === 0) return 'No posts found.';
        return posts.map(post => `${post.id}: ${post.title}`).join('\n');
    },
    view: async (id) => {
        if (!id) return 'Please provide a post ID.';
        const post = await backend.getPost(BigInt(id));
        if (!post) return `Post with ID ${id} not found.`;
        return `Title: ${post.title}\nTimestamp: ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}\n\n${post.content}`;
    },
    add: async () => {
        const title = await prompt('Enter post title:');
        const content = await prompt('Enter post content:');
        if (!title || !content) return 'Post creation cancelled.';
        const id = await backend.addPost(title, content);
        return `Post created with ID: ${id}`;
    },
    clear: () => {
        output.innerHTML = '';
        return '';
    }
};

async function handleCommand(cmd) {
    const [command, ...args] = cmd.trim().split(' ');
    if (commands[command]) {
        const result = await commands[command](...args);
        return result;
    } else {
        return `Unknown command: ${command}. Type 'help' for available commands.`;
    }
}

function prompt(message) {
    return new Promise(resolve => {
        const promptElement = document.createElement('div');
        promptElement.textContent = message;
        output.appendChild(promptElement);

        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style.backgroundColor = 'transparent';
        inputElement.style.border = 'none';
        inputElement.style.color = '#33FF33';
        inputElement.style.fontFamily = '"Courier New", monospace';
        inputElement.style.fontSize = '16px';
        inputElement.style.outline = 'none';
        inputElement.style.width = '100%';

        output.appendChild(inputElement);
        inputElement.focus();

        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const value = inputElement.value;
                inputElement.remove();
                resolve(value);
            }
        });
    });
}

input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value;
        input.value = '';
        output.innerHTML += `<div>$ ${cmd}</div>`;
        output.innerHTML += '<div class="loading">Processing</div>';
        const result = await handleCommand(cmd);
        output.lastChild.remove(); // Remove loading indicator
        output.innerHTML += `<div>${result}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
    }
});

// Initial help message
output.innerHTML = 'Welcome to the Crypto Terminal Blog. Type \'help\' for available commands.';
