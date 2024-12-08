import requests
import random
import time
import itertools
PROM_GATEWAY_URL = "http://localhost:9091/metrics/job/demo_job"

def export_metrics(metric_name:str , version:str):
    metric_descriptor_list = ["min","max","avg","count"]
    metric_list = ["metricA","metricB","metricE","metricD"]
    combinations = list(itertools.product(metric_list,metric_descriptor_list))
    data_line = ""
    for metric,metric_descriptor in combinations:
        data = f'"metric"="{metric}","metric_descriptor"="{metric_descriptor}","version"="{version}"'
        data_line +=  f"{metric_name}{{{data}}} {random.randint(1,20)}\n"
    # print(data_line)
    res = requests.post(PROM_GATEWAY_URL,data_line)
    # print(res.content)
if __name__ == "__main__":
    version_template = "{major_version}.{minor_version}.{patch_version}"
    major_version = random.randint(100,999)
    patch_version = random.randint(1,20)
    for i in range(60):
        minor_version = random.randint(1,5)
        version = version_template.format(major_version=major_version,minor_version=minor_version,patch_version=patch_version)
        export_metrics("perf_latency",version=version)
        time.sleep(10)
        
