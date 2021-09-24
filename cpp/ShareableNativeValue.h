//
// Created by Michał Osadnik on 24/09/2021.
//

#ifndef MULTITHREADINGEXAMPLE_SHAREABLENATIVEVALUE_H
#define MULTITHREADINGEXAMPLE_SHAREABLENATIVEVALUE_H

#include <memory>
#include <jsi/jsi.h>
#include <unordered_map>

enum class ValueType {
    StringType,
    ArrayType,
    ObjectType,
};

class ValueNativeWrapper {};

using namespace facebook;


class ShareableNativeValue {
public:
    static std::shared_ptr<ShareableNativeValue> adapt(jsi::Runtime &rt, const jsi::Value &value);
    std::shared_ptr<ValueNativeWrapper> valueContainer;
    ValueType type;
    inline bool isString() {
        return type == ValueType::StringType;
    }
    inline bool isArray() {
        return type == ValueType::ArrayType;
    }

    inline bool isObject() {
        return type == ValueType::ObjectType;
    }
};

class ObjectNativeWrapper : ValueNativeWrapper {
public:
    std::shared_ptr<ShareableNativeValue> getProperty(std::string name);
    static std::shared_ptr<ValueNativeWrapper> create(jsi::Runtime &rt, const jsi::Object value);
private:
    std::unordered_map<std::string, std::shared_ptr<ShareableNativeValue>> value;
private:


};

class ArrayNativeWrapper : ValueNativeWrapper {
public:
    std::shared_ptr<ShareableNativeValue> getValueAtIndex(long i);
    static std::shared_ptr<ValueNativeWrapper> create(jsi::Runtime &rt, jsi::Array value);
private:
    std::vector<std::shared_ptr<ShareableNativeValue>> value;
};


class StringNativeWrapper : ValueNativeWrapper {
public:
    std::string getValue();
    static std::shared_ptr<ValueNativeWrapper> create(jsi::Runtime &rt, jsi::String value);
private:
    std::string value;

};






#endif //MULTITHREADINGEXAMPLE_SHAREABLENATIVEVALUE_H
