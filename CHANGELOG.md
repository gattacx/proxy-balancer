# Changelog

All notable changes to `@voytenkodev/proxy-balancer` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- No unreleased changes yet.

## [0.0.8] - 2025-03-09

### Added
- **Generic Type Support**: Added support for generics in `ProxyBalancer`, allowing users to attach custom data to proxies via the `customValue` parameter.
- **Custom Value Functionality**: Introduced an optional `customValue` parameter in the `loadProxies` method. This accepts a function `(proxy: Proxy) => T` to generate custom data for each proxy, enhancing flexibility for advanced use cases (e.g., attaching metadata like IDs or priorities).
- Updated documentation to reflect the new generic support and `customValue` feature.

### Changed
- Modified `loadProxies` to accept an optional `customValue` argument, which is passed to the `enrichedProxies` utility.
- Updated the `EnrichedProxy` type to include an optional `customValue` field of type `T`.
with basic proxy validation, performance tracking, and load balancing features.