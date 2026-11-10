# Purchase Decision Tool

[![Build Status](https://github.com/JosaphatCornelius/purchase-decision-tool/actions/workflows/production.yml/badge.svg)](https://github.com/JosaphatCornelius/purchase-decision-tool/actions/workflows/production.yml)

A simple web application that helps you decide whether something is affordable. It shows the impact of a purchase alongside the projected opportunity cost of holding back.

**Live site:** [purchase.josaphatcornelius.tech](https://purchase.josaphatcornelius.tech)

## Why This Project?

When it comes to pulling the trigger on a product or service I think I need, hesitation always hits. This little project is meant to help me see what a purchase would do to my finances, next to the opportunity cost if I held back. Just a fun project.

## Tech Stack

* **Core:** Next.js 16, React 19 (JavaScript)
* **Styling & UI:** Tailwind CSS 4, Framer Motion
* **Other libraries:** html-to-image
* **Database:** None
* **Infrastructure:** Docker (Docker Compose) on a self-hosted VPS
* **CI/CD:** GitHub Actions

## Quick Start

Instructions to get the development environment running locally.

```bash
# Clone the repository
git clone https://github.com/JosaphatCornelius/purchase-decision-tool.git
cd purchase-decision-tool

# Install dependencies and run
npm install
npm run dev
```

*Note: Ensure you have Node.js installed. The dev server runs at `http://localhost:3000` by default.*

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

### Docker

The included `docker-compose.yml` pulls a prebuilt image and joins an external `apisix_frontend` network. Set these environment variables before running it:

```bash
REGISTRY=<your-registry>
NAMESPACE=<your-namespace>
CONTAINER_NAME=<container-name>
DOCKER_TAG=latest   # optional, defaults to latest
```

```bash
docker compose up -d
```

*Note: The `apisix_frontend` network must already exist (`docker network create apisix_frontend`). To build the image locally instead, uncomment the `build` section in `docker-compose.yml`.*

## Usage

Open the app, enter the details of the purchase you're considering, and see how it affects your finances compared with the opportunity cost of not buying.

There is no API at the moment.

## Contributing & License

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

License: none at the moment.
