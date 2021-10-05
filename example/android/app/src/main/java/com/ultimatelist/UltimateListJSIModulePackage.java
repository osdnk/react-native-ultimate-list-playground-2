package com.ultimatelist;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.JSIModuleProvider;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JSIModuleType;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.fabric.ComponentFactory;
import com.facebook.react.fabric.CoreComponentsRegistry;
import com.facebook.react.fabric.FabricJSIModuleProvider;
import com.facebook.react.fabric.ReactNativeConfig;
import com.facebook.react.uimanager.ViewManagerRegistry;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

import java.util.ArrayList;
import java.util.List;

public class UltimateListJSIModulePackage extends ReanimatedJSIModulePackage {
    ReactNativeHost mReactNativeHost;
    public UltimateListJSIModulePackage(ReactNativeHost reactNativeHost) {
        super();
        mReactNativeHost = reactNativeHost;
    }
    private static boolean ENABLE_FABRIC = true;
    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        UltimateNativeModule.install(reactApplicationContext, jsContext);
        try {
            super.getJSIModules(reactApplicationContext, jsContext);
        } catch (Error e) {

        }

        // copied from RN
        final List<JSIModuleSpec> specs = new ArrayList<>();

        // Install the new renderer.
        if (ENABLE_FABRIC) {
            specs.add(
                    new JSIModuleSpec() {
                        @Override
                        public JSIModuleType getJSIModuleType() {
                            return JSIModuleType.UIManager;
                        }

                        @Override
                        public JSIModuleProvider<UIManager> getJSIModuleProvider() {
                            final ComponentFactory ComponentFactory = new ComponentFactory();
                            CoreComponentsRegistry.register(ComponentFactory);
                            final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();

                            ViewManagerRegistry viewManagerRegistry =
                                    new ViewManagerRegistry(
                                            reactInstanceManager.getOrCreateViewManagers(
                                                    reactApplicationContext));

                            return new FabricJSIModuleProvider(
                                    reactApplicationContext,
                                    ComponentFactory,
                                    // TODO: T71362667 add ReactNativeConfig's support in RNTester
                                    new ReactNativeConfig() {
                                        @Override
                                        public boolean getBool(final String s) {
                                            return false;
                                        }

                                        @Override
                                        public int getInt64(final String s) {
                                            return 0;
                                        }

                                        @Override
                                        public String getString(final String s) {
                                            return "";
                                        }

                                        @Override
                                        public double getDouble(final String s) {
                                            return 0;
                                        }
                                    },
                                    viewManagerRegistry);
                        }
                    });
        }

        return specs;
    }
}
