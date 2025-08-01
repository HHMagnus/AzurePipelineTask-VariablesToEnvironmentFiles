# Variables to .env files
An Azure pipeline task step to convert variables into separate .env files for multiple different containers by using predefined prefixes.

## Motivation
We previously deployed environments by mapping all Azure DevOps variables directly to environment variables in the running container. This ensured consistent setup across environments. However, a need arose to change the `ConnectionString` for a specific environment without affecting the others.

To handle this, a task was created to support two distinct `ConnectionString`  values, enabling environment-specific overrides. The task was initially tested in the test environment, but the associated project was later cancelled in 2022, and it has not been used since.

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
