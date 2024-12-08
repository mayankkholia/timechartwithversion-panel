import requests
import random
import time
PROM_GATEWAY_URL = "http://localhost:9091/metrics/job/demo_job"

def export_metrics(metric_name:str , data:dict):
    lables_list = []
    for key,value in data.items():
        lables_list.append(f'"{key}"="{value}"')
    data_line = ",".join(lables_list)
    data_line =  f"{metric_name}{{{data_line}}} {random.randint(1,20)}\n"
    print(data_line)
    res = requests.post(PROM_GATEWAY_URL,data_line)
    print(res.content)
if __name__ == "__main__":
    version_template = "{major_version}.{minor_version}.{patch_version}"
    major_version = random.randint(100,999)
    patch_version = random.randint(1,20)
    for i in range(60):
        minor_version = random.randint(1,5)
        version = version_template.format(major_version=major_version,minor_version=minor_version,patch_version=patch_version)
        export_metrics("perf_latency",data={
            "version": version,
            "labelA":"valueB"
        })
        time.sleep(10)
        
