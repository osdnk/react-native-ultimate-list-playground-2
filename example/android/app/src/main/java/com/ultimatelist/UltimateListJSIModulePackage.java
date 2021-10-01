package com.ultimatelist;

import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

import java.util.List;

public class UltimateListJSIModulePackage extends ReanimatedJSIModulePackage {
    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        UltimateNativeModule.install(reactApplicationContext, jsContext);
        try {
            return super.getJSIModules(reactApplicationContext, jsContext);
        } finally {
        }
    }
}
