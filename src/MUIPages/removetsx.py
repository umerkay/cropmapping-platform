import os

def remove_tsx_files(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                os.remove(file_path)
                print(f'Removed: {file_path}')

if __name__ == "__main__":
    directory = input("Enter the directory to clean up: ")
    remove_tsx_files(directory)
