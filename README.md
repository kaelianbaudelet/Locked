# Locked

**Locked** is a web application designed as a practical add-on for **ControlD** users. It makes it easy to manage access to sites blocked or unblocked by **ControlD DNS**, while providing additional security information for each domain. To use this project you need a **ControlD subscription**.

# How does it work?

# Features

When **ControlD** blocks a site, a customised blocking page is displayed (if this option is enabled in ControlD). Locked integrates directly with this page to provide a simplified management experience:

- **Instant unblocking**: Locked interacts with the ControlD API to unblock the site instantly. This feature enables access to be restored quickly while maintaining visibility of the site's security information.

- **Fast blocking**: as well as unblocking, the Locked application can also block a site in a matter of seconds. Simply enter the URL of a domain in the Locked interface to add it to the ControlD blocking lists.

- **ControlD subscription tracking**: in Locked, users can quickly see information about their ControlD subscription, including the number of days remaining.

Locked transforms the management of blocked and unblocked sites into a simple, secure and efficient process.

# Requirements

> [!IMPORTANT]
> To use Locked, you will need :
>
> - A ControlD subscription in Some Control or Full Control.
> - A VirusTotal API key to access domain security information (optional but recommended).
> - An active ControlD API key.

# Installation ()

Follow the steps below to install the development repo and start Locked :

1. Clone the repository :

```bash
git clone https://github.com/ton-utilisateur/locked.git
```

2. Install the dependencies :

```bash
cd locked
npm install
```

Here's an improved version:

3. Configuring the `.env` file

Copy the `.env.example` file and rename it to `.env`.

- **ControlD API Key** (requis) :
  > [!IMPORTANT]
  > Make sure you configure a ControlD API key with **write permissions**.

Paste your **ControlD API** key into the `.env` file to activate the blocking and unblocking functions.

- **VirusTotal API Key** (facultatif) :

To display domain security information, also paste your **VirusTotal API** key to the `.env` file.

4. Run Locked

```bash
npx next dev
```

# License

Copyright © 2024 Kaelian BAUDELET and contributors.

Code published under the **MIT licence.**
