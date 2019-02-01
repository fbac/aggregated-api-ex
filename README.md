# Aggregated API Server Example

### Concept

Kubernetes API can be easily extended thanks to multiple mechanism, such as Custom Resources (recommended way to do it) or directly by claiming an API path and serving the API endopints on it with your own apiserver, thanks to its [aggregation layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/).

In this repository I'm extending the api with the simplest application possible, it's built in node.js and only serves two handlers, which will be proxied by the kubernetes API to the service where my apiserver listens.

### Install

- Create the apiserver

    ```bash
    $ oc new-project aggregated-api-ex
    $ oc process -f https://raw.githubusercontent.com/fbac/aggregated-api-ex/master/deploy/template.yaml | oc apply -f -
    $ oc start-build aggregated-api-ex
    ```

- Create the APIService, which is the kubernetes object doing all the work, it looks like:

    ```yaml
    apiVersion: apiregistration.k8s.io/v1
    kind: APIService
    metadata:
    labels:
        kube-aggregator.kubernetes.io/automanaged: onstart
    name: API_NAME
    spec:
    caBundle: CA_BUNDLE
    group: API_GROUP
    groupPriorityMinimum: 17100
    service: 
        name: SVC
        namespace: NS
    version: VERSION
    versionPriority: 9
    ```

    - **caBundle** is a PEM encoded CA bundle which will be used to validate an API server's serving certificate. IIn this case the service is signed by a service-signer-certificate automatically, so the CA is `/etc/origin/master/service-signer.crt` encoded in base64.

    -  **VersionPriority** controls the ordering of this API version inside of its group.

    - **GroupPriorityMininum** is the priority this group should have at least. Higher priority means that the group is preferred by clients over lower priority ones.


    ```yaml
    apiVersion: apiregistration.k8s.io/v1
    kind: APIService
    metadata:
    labels:
        kube-aggregator.kubernetes.io/automanaged: onstart
    name: v1beta1.test.k8s.io
    spec:
    caBundle: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURDakNDQWZLZ0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRc0ZBREEyTVRRd01nWURWUVFEREN0dmNHVnUKYzJocFpuUXRjMlZ5ZG1salpTMXpaWEoyYVc1bkxYTnBaMjVsY2tBeE5UUTRPVFExTXprM01CNFhEVEU1TURFegpNVEUwTXpZek9Gb1hEVEkwTURFek1ERTBNell6T1Zvd05qRTBNRElHQTFVRUF3d3JiM0JsYm5Ob2FXWjBMWE5sCmNuWnBZMlV0YzJWeWRtbHVaeTF6YVdkdVpYSkFNVFUwT0RrME5UTTVOekNDQVNJd0RRWUpLb1pJaHZjTkFRRUIKQlFBRGdnRVBBRENDQVFvQ2dnRUJBTEQ2ZHpSUnZuNU5BL2dVTzA1cHh1eXE5ZFhhblVscEVNZkM3OFg3eGREMgpLQ0NKK1JhMWk3MFBxMmhKYnlMTkU4Z2p5dTdpZ0RKcHQxcVVMV0ViWU02SUxJUUZYTUJZNWNDdG9rQmsxOEpQCkp5MXNSUk5jbmJwVHdIVkllV3ZiR2NxM2EzQWJ1MFk3dGJ3OVJWTFA2Z25GanhLMHZxRGR0TG5QZ3dBL2tqbWIKZkc3NU9MRkZlKytPd3BjdzFvNXllN21kZU1zR295bTBUa2N6TjJ4R0hXR0c3VytEM1pRNjExTW1tNVJTTEYvOQpmZXQrQ3RMSEd5Z2lKcE5qR0k0OGwwck5EcDJKZ2o3MjBMeG1GRXVVVHBFQklMWTlTMkJzY05PRkdzK2pCekVRCi9MN2c1T2RCZ0JlK0NPNVRManlSZFhkbjFqUWRlMXhLTDhac1F4RGRFY1VDQXdFQUFhTWpNQ0V3RGdZRFZSMFAKQVFIL0JBUURBZ0trTUE4R0ExVWRFd0VCL3dRRk1BTUJBZjh3RFFZSktvWklodmNOQVFFTEJRQURnZ0VCQUtHTwpTcWhhZmdxMnNQN0Q5eC91RXErbVJTVk42a2x2MjFOYTNTRGtBZzY3NHFtVVFoNHFBUm5weDAwc0JPM3ZwRHYzCnRTUTJ1ckZrTU9wSWFMbjVYZUdub2JOT2E5eW16N0tEWFJUbzJnL2tUa3NnenBQSlVWaVhXWVVnYU9ucit2VE4KRm5OOTk4ZzkvRnB6K3ZBamlTVmh3eVE3YWkzOXhwbVBBRzBjRGU3eXFYOEJSd0lvMVpYVzBnS05JbmZmZktWTwo2TUw1VVVHaEJQeDE0enJVTDdxU3VTeWpWalhiaFNwUlRMYXEvdkxtWFNMbzJNaC9BTlo2bzdYVkRLamlvRDlJCmZmOFhEKzg0bExzMzR3NjlONmdvOVpjQmNSMkl0U2JIV0RxQkxsdmdRWHZlOWozby9RWjRZbklnWnBCWTZ3RDQKand4dHFtM1ZWOE4zQUVuOVQyQT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=
    group: test.k8s.io
    groupPriorityMinimum: 17100
    service:
        name: aggregated-api-ex
        namespace: aggregated-api-ex
    version: v1beta1
    versionPriority: 9
    ```

- Create the APIService
  
    ```bash
    $ oc create -f apiservice.yaml
    $ oc get apiservice 
    ```

### References
- [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder)
- [kubebuilder](https://github.com/kubernetes-sigs/kubebuilder)