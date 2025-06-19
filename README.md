# VectorSeek AI Search

Contributors: stephentwalker

Tags: private AI search, AI search, site search, semantic search

Requires at least: 5.6

Tested up to: 6.8

Stable tag: 0.0.6

Requires PHP: 7.4

License: GPLv3 or later

License URI: https://www.gnu.org/licenses/gpl-3.0.html

VectorSeek brings powerful private AI search to your WordPress site. Index your
content and provide fast, intelligent answers to users.


## Description

**VectorSeek AI Search** transforms your WordPress website into an intelligent, private-search experience powered by your own content. Built for businesses, media publishers, and knowledge-rich websites, VectorSeek helps your visitors and team find answers instantly — with zero training leakage.

🔐 **Privacy-First**
Choose to use our private LLMs or connect to public models. VectorSeek runs indexing and AI querying through private, secure infrastructure.

⚡ **Blazing Fast Answers**
Built on vector embeddings and retrieval-augmented generation (RAG), VectorSeek delivers high-quality answers from your actual site data.

🧠 **Smart Content Indexing**
Automatically pulls and indexes your WordPress pages, posts, PDFs, and other content types.

💬 **Customizable Search Embedding**
Choose to include VectorSeek in your search results page, or add a VectorSeek query box with a simple shortcode.

## Features

- Private vector-based AI search
- Semantic understanding of your content
- Embedded AI Search
- Supports WordPress posts, pages, PDFs, and custom post types
- No data sent to OpenAI or public APIs (unless selected)

## Installation

1. Upload the plugin files to the `/wp-content/plugins` directory, or install via the WordPress plugin admin panel.
2. Activate the plugin through the ‘Plugins’ menu in WordPress.
3. Create an account on [VectorSeek](https://vectorseek.ai)
3. Visit **Settings > VectorSeek** to connect your VectorSeek account and begin indexing.
4. Use the provided shortcode or block to add the search box to your pages.

## Frequently Asked Questions

### How does this work?
VectorSeek indexes your site content and hosts a private vector database. When users ask questions, it retrieves and summarizes the most relevant answers from your indexed content using hosted LLMs or public LLMs if you choose. 

### Is my data safe?
Yes. All processing occurs through secure, private infrastructure. Your content
is not used to train public AI models (unless you choose a public model).
Multiple private and public Providers and Models are available in your
VectorSeek account and you have the ability to choose from any model available. 

### Can I control which content is indexed?
Yes — you can include or exclude specific post types, categories, or pages in the plugin settings.

### Does it work with PDFs or custom post types?
Absolutely. PDFs, pages, blog posts, and most custom post types are supported.

### Can I crawl sub-domains?
Yes, you can crawl multiple domains and sub-domains as part of a single project. All crawled content will be used to generate answers. 

### Can I use sitemap.xml?
Yes, you can add your url with sitemap as one of the urls, ex. https://vectorseek.ai/sitemap.xml

## Screenshots

1. Plugin settings and content indexing options
2. VectorSeek account settings
3. Example of AI-generated answers from site content

## Libraries Used / Github Repo 

### CommonMark 

[CommonMark](https://github.com/commonmark/commonmark.js/) 

### js-cookie

[js-cookie](https://github.com/js-cookie/js-cookie) 

### vectorseek-ai-wp

[vectorseek-ai-wp](https://github.com/stw/vectorseek-ai-wp) 

## External Services 

### ipify.org 

This plugin connects to an API to obtain your IP address information, it's
requested to allow troubleshooting of any issues connecting to the vectorseek.ai servers.

It sends the user's IP to the vectoseek.ai servers along with query information to allow 
identification of where queries are originating.

This service is provided by [ipify](https://www.ipify.org/) and is not shared with any third parties.

[Terms of Service](https://geo.ipify.org/terms-of-service)
[Privacy Policy](https://geo.ipify.org/privacy-policy)

## Changelog

### 0.0.6 

* Fix warnings 

### 0.0.5 

* Updates to be compatible with wordpress guidelines. 

### 0.0.4
* Initial release: private AI search with semantic indexing and chatbot widget

## Upgrade Notice

### 0.0.6 

Fix plugin warnings 

### 0.0.5 
First version compatible with wordpress guidelines

### 0.0.4
First stable release — secure AI search for your WordPress content.

