# ProxyBalancer

ProxyBalancer is a lightweight TypeScript library designed to manage and distribute requests across multiple proxy servers efficiently. It provides proxy validation, performance tracking, and intelligent load balancing based on request rates and usage.

## Features
- Proxy validation with timeout configuration
- Tracks proxy performance: response time, requests per second (RPS), and usage count
- Smart proxy selection based on configurable maximum RPS
- Asynchronous operations for proxy checking and selection
- Simple API for integration into any Node.js project

## Installation

```bash
npm install proxy-balancer

```
## Quick start
```bash
import { ProxyBalancer } from 'proxy-balancer';

const proxies = [
  { host: '192.168.1.10', port: 8080 },
  { host: '10.0.0.5', port: 3128, username: 'admin', password: 'secret' },
];

const balancer = new ProxyBalancer(proxies, { timeout: 4000, maxRPS: 5 });

async function run() {
  await balancer.loadProxies(); // Initialize and validate proxies
  const proxy = await balancer.next(); // Get the best available proxy
  console.log('Selected proxy:', proxy);
  balancer.getState(); // Display proxy stats
}

run().catch(console.error);
```

## Configuration

- **`proxies`**: Array of proxy objects:
    - `host`: string (required) - Proxy IP or hostname
    - `port`: number (required) - Proxy port
    - `username`: string (optional) - Authentication username
    - `password`: string (optional) - Authentication password
- **`options`** (optional):
    - `timeout`: number (default: 3000) - Timeout for proxy checks in milliseconds
    - `maxRPS`: number (default: 5) - Maximum requests per second per proxy

## Methods

- **`loadProxies()`**: Validates and prepares proxies for use.
- **`next()`**: Returns the next available proxy based on RPS and usage.
- **`getState()`**: Logs a table of current proxy stats.


## Use Cases

- Scraping websites with rate-limited proxies
- Distributing API requests across multiple proxies
- Testing proxy reliability and performance

## Dependencies

- `axios` - Used for proxy validation via HTTP requests