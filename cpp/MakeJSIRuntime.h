#pragma once

#include <jsi/jsi.h>
#include <memory>

using namespace facebook;

namespace osdnk {
namespace ultimatelist {

/**
 * Create a new jsi::Runtime with the configured JS engine.
 *
 * Supported Engines:
 *
 *  - Hermes
 *  - V8
 *  - JavaScriptCore
 */
std::unique_ptr<jsi::Runtime> makeJSIRuntime();
  
}
}
