# Changelog

All notable changes to `@voytenkodev/proxy-balancer` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.3] - 2025-03-10

### Added
- **Field in enriched proxy**: Added new field url. returned full url:
username:password@host:port or host:port if username and password not found
- **Exported `getProxyURL` Function**: Added `getProxyURL` to the library's exports. This utility function generates a full proxy URL in the format `username:password@host:port` (if credentials are provided) or `host:port` (if not), improving usability for proxy string generation.

## [0.1.0] - 2025-03-09

### Added
- **Custom Value Functionality**: Introduced an optional `customValue` parameter in the `loadProxies` method. This accepts a function `(proxy: Proxy) => T` to generate custom data for each proxy, enhancing flexibility for advanced use cases (e.g., attaching metadata like IDs or priorities).
- Updated documentation to reflect the new generic support and `customValue` feature.

### Changed
- Modified `loadProxies` to accept an optional `customValue` argument, which is passed to the `enrichedProxies` utility.
- Updated the `EnrichedProxy` type to include an optional `customValue` field of type `T`.
with basic proxy validation, performance tracking, and load balancing features.

