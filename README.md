# Variables to .env files
An Azure pipeline task step to convert variables into separate .env files for multiple different containers by using predefined prefixes.

## Usage
Specify a list of environment using multiple lines:  
```
env1
env2
```

Variables prefixed with either `env1.` or `env2.` will go into the `env1.env` and `env2.env` files respectively.  
Variables that does not contain one of the defined prefixes will be ignored.

## Example
For example the following variables ({name} : {value}):
```
env1.ConnectionString : Host=xx;Port=xx;...;
env2.SomeValue : true
Unrelated : somevalue
```

Would generate the following files:  
**env1.env**
```
ConnectionString=Host=xx;Port=xx;...;
```
**env2.env**
```
SomeValue=true
```

## YAML
```
steps:
- task: variablesToEnvironmentFiles@0
  displayName: 'Variables to .env files'
  inputs:
    filepath: folder
    environments: |
     env1
     env2
```
