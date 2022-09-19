# Variables to .env files
An Azure pipeline step to convert variables into separate .env files for multiple different containers

## Usage
Specify a list of environment using multiple lines:  
```
env1
env2
```

Variables prefixed with either `env1.` or `env2.` will go into that .env file respectively.

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