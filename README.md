# OpenEDC Server

[OpenEDC](https://openedc.org/) is a free and open-source electronic data capture (EDC) system that lets you create and conduct secure clinical research studies based on the [CDISC ODM-XML](https://www.cdisc.org/standards/data-exchange/odm) format.

While the OpenEDC App is a standalone progressive web application (PWA), the OpenEDC Server can be used to move from a single-user to a multi-user and multi-site research project with automated data backup. For this purpose, the OpenEDC Server provides an authentication and authorization service with a file storage. Since data is encrypted before it is sent from the OpenEDC App to the server, the server has no reading access to the data itself. It only stores encrypted files and manages access to them.

The repository of the OpenEDC App can be found [here](https://github.com/imi-muenster/OpenEDC).

## Getting Started

These instructions will get you an OpenEDC Server up and running.

### Prerequisites

You need to have Deno installed on your machine which can be downloaded [here](https://deno.land).

### Installing

After installing Deno, download all files from this repository and move them to a directory on your machine. All metadata and captured clinical data files will be later stored in this directory as well.

Then, download all OpenEDC App files from [here](https://deno.land) and move them to the *public* folder within the previously created OpenEDC Server directory.

### Deployment

Open your terminal, navigate to the folder where you placed the OpenEDC Server files and execute the following command

```
deno run --allow-read --allow-write --allow-net app.js [port] [instance_name]
```

Replace `[port]` with the port number you would like to run the OpenEDC Server at. This can be 3000, for example. If you would like to run multiple server instances on one machine, you can also specify an `[instance_name]`. The server will then create a new directory with all files for this instance. Do not forget to specify a different port number for each instance. If you only want to run a single instance, you can omit the instance name.

## Contributing

Feel free to submit reasonable changes like bugfixes or functional additions. We will look into and test every contribution and will accept it in case it provides value for the general community. When you are planning to make an extensive contribution, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository.

## Authors

* **Leonard Greulich** *(inital work)* | +49 (251) 83-54730 | leonard.greulich@uni-muenster.de

## License

This project is licensed under the MIT License — see the [LICENSE.md](LICENSE.md) file for details.
